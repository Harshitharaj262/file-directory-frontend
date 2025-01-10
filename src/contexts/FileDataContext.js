import { useEffect, createContext, useContext, useState } from "react";

const FileDataContext = createContext(); // Correct Context

function FileDataProvider({ children }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api")
      .then((res) => res.json())
      .then((result) => {
        setFiles(result.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const value = {
   files,
  };

  return (
    <FileDataContext.Provider value={value}>
      {children}
    </FileDataContext.Provider>
  );
}

export const useFileData = () => {
  // Correct usage of useContext with FileDataContext
  return useContext(FileDataContext);
};

export default FileDataProvider;
