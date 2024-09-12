import React, { useState } from "react";

export default function Input({
  type,
  placeholder,
  autoFocus,
  required,
  minLength,
  value,
  onChange,
}) {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === "") {
      setError("Field cannot be empty");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full text-base px-4 py-3 rounded-lg bg-white border focus:border-[#305973] focus:bg-white focus:outline-none"
      autoComplete="true"
      autoFocus={autoFocus}
      required={required}
      minLength={minLength}
      value={value}
      onChange={handleInputChange}
    />
  );
}
