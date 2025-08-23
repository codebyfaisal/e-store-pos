import React, { useState } from "react";
import { ConfirmModal } from "@/components/index.js";
import { useApiDataStore, useAuthStore } from "@/store/index.js";
import api from "@/services/api";
import toast from "react-hot-toast";

const FormControl = ({ value, onChange, name, label }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} <span className="text-red-600">*</span>
      </span>
    </label>
    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      className="input input-bordered w-full"
      required
    />
  </div>
);

const SecurityPage = () => {
  const { logout } = useAuthStore();
  const { updateData } = useApiDataStore();
  const [loading, setLoading] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") setCurrentPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmNewPassword") setConfirmNewPassword(value);
    setPasswordChangeError(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordChangeError(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeError("All password fields are required.");
      setLoading(false);
      return;
    }

    await updateData("/api/users/profile/password", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setLoading(false)
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await api.delete("/api/users/profile");
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Failed to delete.");
        logout();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete account.");
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="bg-base-100 p-8 rounded shadow-xs max-w-xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-base-content">
          Security Settings
        </h1>

        {/* Change Password Form */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Using FormControl for Current Password */}
            <FormControl
              value={currentPassword}
              onChange={handlePasswordChangeInput}
              name="currentPassword"
              label="Current Password"
            />
            {/* Using FormControl for New Password */}
            <FormControl
              value={newPassword}
              onChange={handlePasswordChangeInput}
              name="newPassword"
              label="New Password"
            />
            {/* Using FormControl for Confirm New Password */}
            <FormControl
              value={confirmNewPassword}
              onChange={handlePasswordChangeInput}
              name="confirmNewPassword"
              label="Confirm New Password"
            />

            {passwordChangeError && (
              <div className="text-error text-sm text-center">
                {passwordChangeError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>

        <hr className="border-base-content/20 my-8" />

        {/* Delete Account Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">
            Delete Account
          </h2>
          <p className="text-warning-content">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={openDeleteModal}
            className="btn btn-error w-full"
            disabled={loading}
          >
            {loading ? "Deleting Account..." : "Delete Account"}
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAccount}
        title="Confirm Account Deletion"
        message={
          <p>
            Are you absolutely sure you want to delete your account? This action
            is irreversible.
          </p>
        }
        confirmText="Yes, Delete My Account"
        confirmBtnClass="btn-error"
        modalId="delete-account-modal"
      />
    </section>
  );
};

export default SecurityPage;
