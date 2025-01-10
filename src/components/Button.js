
import {FolderPlusIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'
function Button({files}){
    return(
        <>
         <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2 mx-2 flex items-center space-x-2">
         <FolderPlusIcon className='transform duration-300 ease h-6 w-6 text-white' />
            <span>Create</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2 mx-2 flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500" disabled={files?.length===0}>
            <PencilSquareIcon className='transform duration-300 ease h-6 w-6 text-white' />

            <span>Rename</span>
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-2 mx-2 flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500" disabled={files?.length===0}>
            <TrashIcon className='transform duration-300 ease h-6 w-6 text-white' />
            <span>Delete</span>
          </button>
        </>
    )
}

export default Button;