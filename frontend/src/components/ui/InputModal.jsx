import React from "react";
import Modal from "./Modal";

const InputModal = ({
  isOpen,
  onClose,
  modalId = "input-modal",
  title = "",
  inputValue,
  onInputChange,
  inputPlaceholder = "",
  error = "",
  onSubmit,
  submitText = "Submit",
  submitBtnClass = "btn-primary",
  onKeyDown,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalId={modalId}>
      <h3 className="font-bold text-lg">{title}</h3>
      {children || (
        <input
          type="text"
          placeholder={inputPlaceholder}
          className={`p-2 w-full my-8 ${error ? "input-error" : ""}`}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          autoFocus
        />
      )}
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex justify-end gap-4">
        <button className={`btn ${submitBtnClass}`} onClick={onSubmit}>
          {submitText}
        </button>
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default InputModal;
