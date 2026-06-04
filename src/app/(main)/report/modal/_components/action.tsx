"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";

interface ActionModalProps {
  isOpen: boolean;
  reportName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ActionModal({
  isOpen,
  reportName,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleDelete() {
    try {
      console.log("Modal: delete clicked");

      setLoading(true);

      await onConfirm();

      console.log("Modal: delete success");
    } catch (err) {
      console.error("Modal error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-3">
          <div className="bg-red-100 text-red-500 p-3 rounded-xl">
            <Trash2 size={22} />
          </div>

          <h2 className="text-xl font-semibold">
            Are you sure?
          </h2>

          <p className="text-center text-sm text-gray-500">
            You want to delete{" "}
            <span className="font-medium text-gray-800">
              {reportName}
            </span>
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-100 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}