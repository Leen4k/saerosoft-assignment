import React from "react";

interface TreeEditorProps {
  selectedId: string;
  selectedLabel: string;
  canDelete: boolean;
  canAdd: boolean;
  onAdd: () => void;
  onDelete: () => void;
  children: React.ReactNode;
  message?: string;
}

export const TreeEditor: React.FC<TreeEditorProps> = ({
  selectedId,
  selectedLabel,
  canDelete,
  canAdd,
  onAdd,
  onDelete,
  children,
  message,
}) => {
  return (
    <div>
      <div className="mb-2 font-semibold">Edit Panel</div>
      <div className="bg-white p-4 border rounded">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">
            Selected: {selectedLabel}
          </div>

          <div className="mb-4">
            {children}

            <button
              className={`${
                canAdd ? "bg-green-500" : "bg-gray-400"
              } text-white px-4 py-2 rounded w-full mb-2`}
              onClick={onAdd}
              disabled={!canAdd}
            >
              Add
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
              onClick={onDelete}
              disabled={!canDelete}
            >
              Delete selected
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="mt-4 text-sm text-gray-600 p-2 border bg-gray-50">
          {message}
        </div>
      )}
    </div>
  );
};
