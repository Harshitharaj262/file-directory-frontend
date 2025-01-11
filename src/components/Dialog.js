import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

function DialogBox({ isDialogOpen, setIsDialogOpen, file, action, onSubmit }) {
  const [newName, setNewName] = useState(action !== "Create" ? file?.name : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();

    if (!trimmedName) return;

    const isFile = /\.[a-zA-Z0-9]+$/.test(trimmedName);
    const type = isFile ? "file" : "folder";
    onSubmit(
      action === "Create"
        ? { id: null, parentId: file?._id || null, name: trimmedName, type }
        : { id: file._id, parentId: file.parentId, name: trimmedName, type }
    );
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      as="div"
      className="relative z-40"
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 overflow-y-auto">
        <div className="flex justify-center items-center px-4">
          <DialogPanel className="transform text-left text-base transition my-16 max-w-4xl">
            <div className="bg-white">
              <div className="px-6 py-8 w-full">
                <h3 className="text-lg font-medium text-gray-900">
                  {action === "Rename"
                    ? `Rename ${file.type}`
                    : action === "Delete"
                    ? `Delete ${file.type}`
                    : `Create New File or Folder`}
                </h3>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    {action === "Delete" ? (
                      <div>
                        Do you want to delete this {file.type}? <br />
                        {file.children.length > 0 && (
                          <span className="text-red-600">
                            Deleting this folder will also remove all its
                            subfolders and files.
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="new-file-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {action === "Rename"
                            ? `${
                                file.type.charAt(0).toUpperCase() +
                                file.type.slice(1)
                              } name`
                            : "Name"}
                        </label>
                        <input
                          type="text"
                          id="new-file-name"
                          name="new-file-name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md p-3"
                          required
                        />
                      </>
                    )}
                  </div>

                  {/* Hidden input for file id */}
                  <input type="hidden" name="file-id" value={file?._id} />
                  <input
                    type="hidden"
                    name="file-parent-id"
                    value={file?.parentId}
                  />

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`${
                        action === "Delete" ? "bg-red-600" : "bg-blue-600"
                      } px-4 py-2 text-white rounded-md text-sm`}
                    >
                      {action === "Rename"
                        ? "Rename"
                        : action === "Delete"
                        ? "Delete"
                        : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default DialogBox;
