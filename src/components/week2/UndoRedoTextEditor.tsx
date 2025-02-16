import React, { useState } from "react";
import { Stack } from "../../utils/stack/Stack";

const UndoRedoTextEditor = () => {
  const [text, setText] = useState("");
  const [history] = useState(new Stack<string>());
  const [redoStack, setRedoStack] = useState(new Stack<string>());

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    history.push(newText);
    setRedoStack(new Stack<string>());
    setText(newText);
  };

  // Undo operation
  const undo = () => {
    if (!history.isEmpty()) {
      redoStack.push(history.pop()!);
      setText(history.peek() || "");
    }
  };

  // Redo operation
  const redo = () => {
    if (!redoStack.isEmpty()) {
      history.push(redoStack.pop()!);
      setText(history.peek() || "");
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
      <button onClick={undo} disabled={history.size() <= 1}>
        Undo (Ctrl+Z)
      </button>
      <button onClick={redo} disabled={redoStack.isEmpty()}>
        Redo (Ctrl+Y)
      </button>
    </div>
  );
};

export default UndoRedoTextEditor;
