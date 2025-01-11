import {
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";

const FileDataContext = createContext(); // Correct Context

const emptyData = {
  files: [],
};

function fileDataReducer(state, action) {
  if (!Object.keys(emptyData).includes(action.type)) {
    throw new Error(`Unhandled action type: ${action.type}`);
  }
  return { ...state, ...{ [action.type]: action.value } };
}
function FileDataProvider({ children }) {
  const [state, dispatch] = useReducer(fileDataReducer, emptyData);

  useEffect(() => {
    fetch(process.env.REACT_APP_BASE_URL)
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "files", value: result.data });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [state.reload]);

  const value = {
    state,
    dispatch,
  };

  return (
    <FileDataContext.Provider value={value}>
      {children}
    </FileDataContext.Provider>
  );
}

const useFileData = () => {
  const context = useContext(FileDataContext);
  if (!context) {
    throw new Error("useFileData must be used within a FileDataProvider");
  }
  return context;
};

export { FileDataProvider, useFileData };
