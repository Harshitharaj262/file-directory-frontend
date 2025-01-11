import { useDrag, useDrop } from "react-dnd";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/solid";

const ItemTypes = {
  FILE: "file",
  FOLDER: "folder",
};

function FileOrFolder({
  file,
  index,
  toggleFolder,
  handleRightClick,
  handleDrop,
  expandedFolders,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: file.type === "folder" ? ItemTypes.FOLDER : ItemTypes.FILE,
    item: file,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: [ItemTypes.FILE, ItemTypes.FOLDER],
    drop: (item) => handleDrop(item, file),
  });

  const isExpanded = expandedFolders.includes(file.name);

  return (
    <div ref={file.type === "folder" ? drop : drag}>
      <div
        className={`${
          isDragging ? "opacity-50" : "opacity-100"
        } flex items-center text-sm py-2 px-4 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } hover:bg-gray-200`}
        onContextMenu={(e) => handleRightClick(e, file)}
      >
        <div ref={drag} className="cursor-grab mr-2">
          <Bars3Icon className="h-5 w-5 text-gray-500" />
        </div>
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

        <div className="flex flex-1 justify-between">
          <div className="w-1/2 text-left  hidden sm:block">
            {file.updatedAt}
          </div>
          <div className="w-1/4 text-left  hidden sm:block">
            {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
          </div>
        </div>
      </div>
      {isExpanded && file.children && file.children.length > 0 && (
        <div className="pl-[20px]">
          {file.children.map((child, childIndex) => (
            <FileOrFolder
              key={child._id}
              file={child}
              index={childIndex}
              toggleFolder={toggleFolder}
              handleRightClick={handleRightClick}
              handleDrop={handleDrop}
              expandedFolders={expandedFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileOrFolder;
