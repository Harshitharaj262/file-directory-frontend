function TableHeader(){
return (
    <div className="flex items-center bg-gray-100 font-semibold text-sm border-b border-gray-300 py-2 px-4">
          <div className="flex-1 text-left">Name</div>
          <div className="flex flex-1 justify-between">
            <div className="w-1/2 text-left">Date Modified</div>

            <div className="w-1/4 text-left">Kind</div>
          </div>
        </div>
)
}
export default TableHeader;