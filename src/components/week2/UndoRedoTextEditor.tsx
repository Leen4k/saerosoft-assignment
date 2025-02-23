import React, { useState } from "react";
import { Stack } from "../../utils/stack/Stack";

const UndoRedoTextEditor = () => {
  const [text, setText] = useState("");
  const [history] = useState(new Stack<string>());
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    //truncation history
    if (currentIndex < history.size() - 1) {
      history.items = history.items.slice(0, currentIndex + 1);
    }

    history.push(newText);
    setCurrentIndex(history.size() - 1);
    setText(newText);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setText(history.items[currentIndex - 1]);
    }
  };

  const redo = () => {
    if (currentIndex < history.size() - 1) {
      setCurrentIndex((prev) => prev + 1);
      setText(history.items[currentIndex + 1]);
    }
  };

  return (
    <div>
      <h1>{text}</h1>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Start typing..."
      ></textarea>
      <br />
      <button onClick={undo} disabled={currentIndex <= 0}>
        Undo (Ctrl+Z)
      </button>
      <button onClick={redo} disabled={currentIndex >= history.size() - 1}>
        Redo (Ctrl+Y)
      </button>
    </div>
  );
};

export default UndoRedoTextEditor;

// v1
// import React, { useState } from "react";
// import { Stack } from "../../utils/stack/Stack";

// const UndoRedoTextEditor = () => {
//   const [text, setText] = useState("");
//   const [history] = useState(new Stack<string>());
//   const [redoStack, setRedoStack] = useState(new Stack<string>());

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newText = e.target.value;
//     history.push(newText);
//     setRedoStack(new Stack<string>());
//     setText(newText);
//   };

//   // revert
//   const undo = () => {
//     if (!history.isEmpty()) {
//       redoStack.push(history.pop()!);
//       setText(history.peek() || "");
//     }
//   };

//   // forward
//   const redo = () => {
//     if (!redoStack.isEmpty()) {
//       history.push(redoStack.pop()!);
//       setText(history.peek() || "");
//     }
//   };

//   return (
//     <div>
//       <h1>{text}</h1>
//       <textarea
//         value={text}
//         onChange={handleInputChange}
//         placeholder="Start typing..."
//       ></textarea>
//       <br />
//       <button onClick={undo} disabled={history.size() <= 1}>
//         Undo (Ctrl+Z)
//       </button>
//       <button onClick={redo} disabled={redoStack.isEmpty()}>
//         Redo (Ctrl+Y)
//       </button>
//     </div>
//   );
// };

// export default UndoRedoTextEditor;
