import React, { useState } from "react";
import { Stack } from "../../utils/collections/collection";
import Modal from "../shared/Modal";

const NestedModalStack = () => {
  const [modalStack] = useState(new Stack<string>());
  const [render, setRender] = useState(0);

  const openModal = (): void => {
    const newModalId = `Modal ${modalStack.size() + 1}`;
    modalStack.push(newModalId);
    setRender((prev) => prev + 1);
  };

  const closeModal = (): void => {
    if (!modalStack.isEmpty()) {
      modalStack.pop();
      setRender((prev) => prev + 1);
    }
  };

  const closeAllModals = (): void => {
    while (!modalStack.isEmpty()) {
      modalStack.pop();
    }
    setRender((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Nested Modals</h1>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={openModal}
      >
        Open Modal
      </button>

      {modalStack.getAllItems().map((modalId, i) => (
        <Modal
          key={i}
          modalId={modalId}
          onClose={closeModal}
          onCloseAll={closeAllModals}
          onOpenNew={openModal}
        />
      ))}
    </div>
  );
};

export default NestedModalStack;
