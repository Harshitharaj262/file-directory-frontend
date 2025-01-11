import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DialogBox from "./Dialog";
function CreateFileOrFolder({ files, setFiles }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState(null);

  const openCreateDialogBox = () => {
    setAction("Create");
    setIsDialogOpen(true);
  };

  const handleCreateFileAndFolder = async (params) => {
    const { parentId, name, type } = params;
    console.log("openCreateDialogBox");
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
    setFiles([...files, result.data]);
  };
  return (
    <>
      <button
        onClick={openCreateDialogBox}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2 mx-2 flex items-center space-x-2"
      >
        <FolderPlusIcon className="transform duration-300 ease h-6 w-6 text-white" />
        <span>Add File/Folder</span>
      </button>

      {isDialogOpen && (
        <DialogBox
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          action={action}
          onSubmit={handleCreateFileAndFolder}
        />
      )}
    </>
  );
}

export default CreateFileOrFolder;
