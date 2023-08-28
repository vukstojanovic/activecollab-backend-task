import Modal from "@mui/material/Modal";
import { useState } from "react";
import { PromptProps } from "../types";

export default function Prompt({
  title,
  closeFn,
  submitFn,
  isOpen,
}: PromptProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim()) return;
    submitFn(value);
    closeFn();
    setValue("");
  }

  return (
    <Modal open={isOpen} onClose={closeFn}>
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[30%] bg-gray-300 rounded-md p-5 ">
        <h3 className="text-lg font-bold mb-5">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="p-1"
          />
          <button className="block mt-3 text-white bg-violet-700 px-3 py-1 rounded-md shadow-md">
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
}
