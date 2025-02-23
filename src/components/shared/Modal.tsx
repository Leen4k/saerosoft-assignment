const Modal = ({
  modalId,
  onClose,
  onOpenNew,
  onCloseAll,
}: {
  modalId: string;
  onClose: () => void;
  onOpenNew: () => void;
  onCloseAll: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
      <button
        className="absolute top-2 right-2 text-red-500 text-xl"
        onClick={onCloseAll}
      >
        &times;
      </button>
      <h2 className="text-xl font-bold">{modalId}</h2>
      <p className="mt-2">This is the content of {modalId}</p>
      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onOpenNew}
        >
          Open New Modal
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
