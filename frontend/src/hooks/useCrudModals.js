import { useState } from "react";

const useCrudModals = ({ existingItems, validateName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [inputValue, setInputValue] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState("");

  const openAddModal = () => {
    setModalMode("add");
    setInputValue("");
    setEditingItem(null);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setInputValue(item.name);
    setEditingItem(item);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setInputValue("");
    setEditingItem(null);
    setError("");
  };

  const validateAndSubmit = (onAdd, onUpdate) => {
    const trimmed = inputValue.trim();
    const validationError = validateName(trimmed);

    if (validationError) {
      setError(validationError);
      return;
    }

    const isDuplicate = existingItems.some(
      (item) =>
        item.name?.toLowerCase() === trimmed.toLowerCase() &&
        (modalMode === "add" || item.id !== (editingItem?.id ?? null)) // safely check editingItem
    );

    if (isDuplicate) {
      setError("Name already exists");
      return;
    }

    if (modalMode === "edit") {
      if (trimmed === editingItem?.name) {
        closeModal();
        return;
      }
    }

    modalMode === "add" ? onAdd(trimmed) : onUpdate(trimmed, editingItem?.id);
    closeModal();
  };

  return {
    modalOpen,
    modalMode,
    inputValue,
    editingItem,
    error,
    setInputValue,
    openAddModal,
    openEditModal,
    closeModal,
    validateAndSubmit,
    setError,
  };
};

export default useCrudModals;
