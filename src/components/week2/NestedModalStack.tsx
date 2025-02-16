import React, { useState } from "react";
import { Stack } from "../../utils/stack/Stack";

const NestedModalStack = () => {
  const [modalStack] = useState(new Stack<string>());
  const [, setRender] = useState(0);

  const openModal = (modalId: string): void => {
    modalStack.push(modalId);
    setRender((prev) => prev + 1);
  };

  const closeModal = (): void => {
    modalStack.pop();
    setRender((prev) => prev + 1);
  };

  const getAllModals = (): string[] => [...modalStack["items"]].reverse();

  return (
    <div>
      <h1>Open Modals</h1>
      <ul>
        {getAllModals().map((modalId, i) => (
          <li key={i}>{modalId}</li>
        ))}
      </ul>
      <button onClick={() => openModal(`Modal ${modalStack.size() + 1}`)}>
        Open New Modal
      </button>
      <button onClick={closeModal} disabled={modalStack.isEmpty()}>
        Close Last Modal
      </button>
    </div>
  );
};

export default NestedModalStack;
