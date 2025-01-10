import "./input.css";
import Button from "./components/Button";
import {FileDataProvider,useFileData} from "./contexts/FileDataContext.js";
import FilesTable from "./components/FileTable";

function AppContent() {
  const filesDataContext = useFileData();
  const fileData = filesDataContext.state
  const dispatchData = filesDataContext.dispatch;
  const files = fileData.files
  const setFiles = (newFileState)=> dispatchData({type:'files',value: newFileState})
  return (
    <div className="App">
      <div className="max-w-6xl mx-auto text-center px-10 my-4">
        <h1>File Management</h1>
        {/* Create files / folder */}
        <div className="flex flex-row justify-center items-center mt-2 lg:items-end lg:justify-end">
          <Button files={files} setFiles={setFiles} />
        </div>
        <div className="min-h-screen rounded-sm shadow-lg">
          <div className="flex items-start justify-start p-8">
            <h2 className="text-black text-[24px] font-serif font-bold">
              Your files
            </h2>
          </div>
          <FilesTable files={files} setFiles={setFiles}/>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <FileDataProvider>
      <AppContent />
    </FileDataProvider>
  );
}

export default App;
