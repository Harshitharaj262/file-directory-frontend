
import { ChevronRightIcon } from "@heroicons/react/24/outline";
function FilesTable({files}) {
   
  return (
    <div className="p-4">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center bg-gray-100 font-semibold text-sm border-b border-gray-300 py-2 px-4">
          <div className="flex-1 text-left">Name</div>
          <div className="flex flex-1 justify-between">
            <div className="w-1/2 text-left">Date Modified</div>

            <div className="w-1/4 text-left">Kind</div>
          </div>
        </div>

        {/* File List */}
        <div>
          {files.length > 0 ? files.map((file, index) => (
            <div
              key={index}
              className={`flex items-center text-sm border-b border-gray-300 py-2 px-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-200`}
            >
              {/* Name on the left */}
              <div className="flex items-center flex-1 truncate text-left">
                <ChevronRightIcon
                  className="transform duration-300 ease h-6 w-6 text-gray-700 mr-2"
                  aria-hidden="true"
                />
                <span className="truncate">{file.name}</span>
              </div>

              {/* Other columns on the right */}
              <div className="flex flex-1 justify-between">
                <div className="w-1/2 text-left">{file.createdAt}</div>
                <div className="w-1/4 text-left">{file.type.charAt(0).toUpperCase()+file.type.slice(1)}</div>
              </div>
            </div>
          ))
          :(
            <div className="text-center text-gray-500">No files found.</div>
          )
          }
        
        </div>
      </div>
    </div>
  );
}
export default FilesTable;
