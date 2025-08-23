import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  confirmBtnClass = "btn-error",
  modalId = "confirm-modal",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalId={modalId}>
      <h3 className="font-bold text-lg text-center">{title}</h3>
      <div className="mt-8 mb-9">{message}</div>
      <div className="flex justify-center gap-4">
        <button className="btn ring-1 ring-base-300" onClick={onClose}>
          Cancel
        </button>
        <button
          className={`btn ${confirmBtnClass} text-white`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
