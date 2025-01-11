import { useState } from "react";
import TableHeader from "./TableHeader";
import DialogBox from "./Dialog";
import FileOrFolder from "./FileOrFolder";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  PencilSquareIcon,
  TrashIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";

function FilesTable({ files, setFiles }) {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isSelected, setIsSelected] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState(null);

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((name) => name !== folderName)
        : [...prev, folderName]
    );
  };
  const handleRightClick = (event, file) => {
    event.preventDefault();
    setIsSelected(file);
    setContextMenu({ x: event.pageX, y: event.pageY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const openCreateDialogBox = () => {
    setAction("Create");
    setIsDialogOpen(true);
    closeContextMenu();
  };
  const handleCreate = async (parentId, name, type) => {
    try {
      const response = await fetch("http://localhost:3001/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          parentId,
        }),
      });
      const result = await response.json();

      if (parentId) {
        const parentFile = files.find((file) => file._id === parentId);
        if (parentFile) {
          parentFile.children.push(result.data);
        }
      }
      setFiles([...files]);
    } catch (error) {
      console.log("Error while creating file", error.message);
    }
  };
  const handleRename = async (id, parentId, name, type) => {
    try {
      const response = await fetch(`http://localhost:3001/api/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });

      const result = await response.json();
      if (response.status !== 200) {
        throw new Error(result.message);
      }
      const oldFile = files.find((file) => file._id === id);
      if (oldFile) {
        oldFile.name = name;
        oldFile.updatedAt = result.data.updatedAt;
        setFiles([...files]);
      }
    } catch (error) {
      console.log("Error while renaming file", error.message);
    }
  };

  const handleDelete = async (id, parentId) => {
    try {
      const response = await fetch("http://localhost:3001/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [id], parentId: parentId }),
      });
      const result = await response.json();
      if (response.status !== 200) {
        throw new Error(result.message);
      }
      if (parentId) {
        // empty child array in files
        const parentFile = files.find((file) => file._id === parentId);
        if (parentFile) {
          parentFile.children = parentFile.children.filter(
            (child) => child._id !== id
          );
        }
      }

      setFiles(files.filter((file) => file._id !== id));
    } catch (error) {
      console.log("Error while deleting file", error.message);
    }
  };
  const handleFileAndFolder = async (params) => {
    const { id, parentId, name, type } = params;
    if (action === "Create") {
      return await handleCreate(parentId, name, type);
    } else if (action === "Rename") {
      return await handleRename(id, parentId, name, type);
    } else {
      return await handleDelete(id, parentId);
    }
  };

  const openRenameDialogBox = () => {
    setAction("Rename");
    setIsDialogOpen(true);
    closeContextMenu();
  };

  const openDeleteDialogBox = () => {
    setAction("Delete");
    setIsDialogOpen(true);
    closeContextMenu();
  };
  const handleDrop = (item, folder) => {
    if (folder._id === item._id || isDescendant(item, folder)) return;

    const updatedFiles = [...files];
    moveItem(updatedFiles, item, folder);
    setFiles(updatedFiles);
  };

  const isDescendant = (item, folder) => {
    if (!folder.children || folder.children.length === 0) return false;
    return folder.children.some(
      (child) => child._id === item._id || isDescendant(item, child)
    );
  };

  const moveItem = async (files, item, targetFolder) => {
    const parent = findParent(files, item);
    if (parent) {
      parent.children = parent.children.filter(
        (child) => child._id !== item._id
      );
    } else {
      const index = files.findIndex((file) => file._id === item._id);
      if (index !== -1) files.splice(index, 1);
    }

    if (targetFolder) {
      if (!targetFolder.children) targetFolder.children = [];
      targetFolder.children.push(item);
    } else {
      files.push(item);
    }
    const sourceId = item._id;
    const destinationId = targetFolder._id;
    try {
      const response = await fetch("http://localhost:3001/api/move", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId,
          destinationId,
        }),
      });
      if (response.status !== 200) {
        throw new Error("Error while moving file");
      }
      await response.json();
    } catch (error) {
      console.log("Error while moving file", error.message);
    }
  };

  const findParent = (files, item) => {
    for (let file of files) {
      if (
        file.children &&
        file.children.some((child) => child._id === item._id)
      ) {
        return file;
      }
      if (file.children) {
        const parent = findParent(file.children, item);
        if (parent) return parent;
      }
    }
    return null;
  };

  const renderFiles = (files) => {
    return files.map((file, index) => (
      <FileOrFolder
        key={file._id}
        file={file}
        index={index}
        toggleFolder={toggleFolder}
        handleRightClick={handleRightClick}
        handleDrop={handleDrop}
        expandedFolders={expandedFolders}
      />
    ));
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="p-4" onClick={closeContextMenu}>
          <div className="w-full">
            <TableHeader />
            <div>
              {files.length > 0 ? renderFiles(files) : "No files found."}
            </div>
          </div>
        </div>
      </DndProvider>
      {contextMenu && isSelected && (
        <div
          className="absolute bg-white border shadow-lg rounded-md z-10"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <ul className="text-sm text-gray-700">
            {isSelected.type === "folder" && (
              <li
                onClick={openCreateDialogBox}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <FolderPlusIcon className="transform duration-300 ease h-5 w-5 text-gray-600 mr-2" />
                <span>Create</span>
              </li>
            )}
            <li
              onClick={openRenameDialogBox}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
            >
              <PencilSquareIcon className="transform duration-300 ease h-5 w-5 text-gray-600 mr-2" />
              <span>Rename</span>
            </li>
            <li
              onClick={openDeleteDialogBox}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
            >
              <TrashIcon className="transform duration-300 ease h-5 w-5 text-gray-600 mr-2" />
              <span>Delete</span>
            </li>
          </ul>
        </div>
      )}
      {isDialogOpen && (
        <DialogBox
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          file={isSelected}
          action={action}
          onSubmit={handleFileAndFolder}
        />
      )}
    </>
  );
}

export default FilesTable;
