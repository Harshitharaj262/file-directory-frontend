import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DialogBox from "./Dialog";
import { toast } from "react-toastify";
function CreateFileOrFolder({ files, setFiles }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState(null);

  const openCreateDialogBox = () => {
    setAction("Create");
    setIsDialogOpen(true);
  };

  const handleCreateFileAndFolder = async (params) => {
    try {
      const { parentId, name, type } = params;
      const response = await fetch(process.env.REACT_APP_BASE_URL + "/create", {
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
      if (response.status !== 201) {
        throw new Error(result.error);
      }
      setFiles([...files, result.data]);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <button
        onClick={openCreateDialogBox}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded my-2 mx-2 flex items-center space-x-2 md:py-2 md:px-4 text-sm md:text-[16px]"
      >
        <FolderPlusIcon className="transform duration-300 ease h-8 w-8 text-white stroke-2" />
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
