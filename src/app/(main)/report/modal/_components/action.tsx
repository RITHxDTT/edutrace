"use client";

import { Trash2, X } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  reportName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ActionModal({
  isOpen,
  reportName,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 w-90 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="bg-red-100 text-red-500 rounded-xl p-3">
            <Trash2 size={22} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
        </div>

        <p className="text-center text-gray-500 text-sm">
          You want to delete{" "}
          <span className="font-medium text-gray-800">{reportName}</span>?
        </p>
        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-medium text-sm"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer font-medium text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
