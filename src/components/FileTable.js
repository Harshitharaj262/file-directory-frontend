import { useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/solid";
import TableHeader from "./TableHeader";
import DialogBox from "./Dialog";

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

      if(parentId){
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

  // Recursively render files and folders
  const renderFiles = (files) => {
    return files.map((file, index) => {
      const isExpanded = expandedFolders.includes(file.name);

      return (
        <div key={file._id}>
          <div
            className={`flex items-center text-sm py-2 px-4 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-200`}
            onContextMenu={(e) => handleRightClick(e, file)}
          >
            {/* Name on the left */}
            <div className="flex items-center flex-1 truncate text-left">
              {file.type === "folder" ? (
                <>
                  <div
                    onClick={() => toggleFolder(file.name)}
                    className="cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon
                        className="transform duration-300 ease h-4 w-4 text-gray-700 mr-2"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRightIcon
                        className="transform duration-300 ease h-4 w-4 text-gray-700 mr-2"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <FolderIcon
                    className="transform duration-300 ease h-6 w-6 text-blue-500 mr-2"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <DocumentIcon
                  className="transform duration-300 ease h-6 w-6 text-gray-500 mr-2"
                  aria-hidden="true"
                />
              )}

              <span className="truncate">{file.name}</span>
            </div>

            {/* Other columns on the right */}
            <div className="flex flex-1 justify-between">
              <div className="w-1/2 text-left">{file.updatedAt}</div>
              <div className="w-1/4 text-left">
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
              </div>
            </div>
          </div>

          {/* Render subfolders if expanded */}
          {isExpanded && file.children && file.children.length > 0 && (
            <div style={{ paddingLeft: "20px" }}>
              {renderFiles(file.children, file.name)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4" onClick={closeContextMenu}>
      <div className="w-full">
        {/* Header */}
        <TableHeader />

        {/* File List */}
        <div>
          {files.length > 0 ? (
            renderFiles(files)
          ) : (
            <div className="text-center text-gray-500">No files found.</div>
          )}
        </div>
      </div>

      {contextMenu && isSelected && (
        <div
          className="absolute bg-white border shadow-lg rounded-md z-10"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <ul className="text-sm text-gray-700">
            {/* Create Option */}
            {isSelected.type === "folder" && (
               <li
              onClick={openCreateDialogBox}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
            >
              <FolderPlusIcon className="transform duration-300 ease h-5 w-5 text-gray-600 mr-2" />
              <span>Create</span>
            </li>
            )}
           

            {/* Rename Option */}
            <li
              onClick={openRenameDialogBox}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
            >
              <PencilSquareIcon className="transform duration-300 ease h-5 w-5 text-gray-600 mr-2" />
              <span>Rename</span>
            </li>

            {/* Delete Option */}
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
    </div>
  );
}

export default FilesTable;
