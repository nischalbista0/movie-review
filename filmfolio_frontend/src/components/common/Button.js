import React from "react";

export default function Button({ text, onClick, disabled = false }) {
  return (
    <button
      type="submit"
      className="w-full text-3xl block bg-[#305973] text-white font-medium rounded-lg px-4 py-2 mt-6 texts"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
