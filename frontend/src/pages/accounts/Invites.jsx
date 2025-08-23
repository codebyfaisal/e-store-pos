import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useApiDataStore } from "@/store/index.js";

import {
  DataTable,
  ConfirmModal,
  Filters,
  InputModal,
  Loader,
} from "@/components/index.js";
import {
  useSortedData,
  useSortConfig,
  useFilteredData,
} from "@/hooks/index.js";

const Invites = () => {
  const [searchParams] = useSearchParams();

  const { fetchData, deleteData, addData, updateData } = useApiDataStore();

  const [filters, setFilters] = useState({
    email: searchParams.get("email") || "",
    role: searchParams.get("role") || "",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invitedUserToDelete, setInvitedUserToDelete] = useState(null);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({
    email: "",
    role: "",
  });
  const [inviteError, setInviteError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingInviteFormData, setEditingInviteFormData] = useState(null);
  const [originalEditingRole, setOriginalEditingRole] = useState(null);
  const [editError, setEditError] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/users/invites");

    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;
    setData([...result]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const invitedRoles = [
    ...new Set(data.map((user) => user.role).filter(Boolean)),
  ];
  const invitedStatuses = [
    ...new Set(data.map((user) => user.status).filter(Boolean)),
  ];

  const openDeleteModal = (user) => {
    setInvitedUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setInvitedUserToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteInvitedUser = async () => {
    if (!invitedUserToDelete) return;
    try {
      await deleteData(`/api/users/invites/${invitedUserToDelete.email}`);
    } catch (err) {
      toast.error("Error deleting invited user.");
    } finally {
      closeDeleteModal();
    }
  };

  const openInviteModal = () => {
    setInviteModalOpen(true);
    setInviteError(null);
    setInviteFormData({ email: "", role: "" });
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
  };

  const handleInviteFormChange = (e) => {
    const { name, value } = e.target;
    setInviteFormData((prev) => ({ ...prev, [name]: value }));
    if (inviteError) setInviteError(null);
  };

  const handleInviteSubmit = async () => {
    if (!inviteFormData.email || !inviteFormData.role) {
      setInviteError("Email and role are required.");
      return;
    }

    try {
      await addData("/api/users/invite", inviteFormData);
      toast.success("Invitation sent successfully!");
      closeInviteModal();
      getData();
    } catch (err) {
      toast.error(err.message || "Failed to send invitation.");
    }
  };

  const openEditModal = (user) => {
    setEditingInviteFormData({ ...user });
    setOriginalEditingRole(user.role);
    setEditModalOpen(true);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingInviteFormData(null);
    setOriginalEditingRole(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingInviteFormData((prev) => ({ ...prev, [name]: value }));
    if (editError) setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editingInviteFormData?.email || !editingInviteFormData?.role) return;

    if (editingInviteFormData.role === originalEditingRole) {
      closeEditModal();
      return;
    }

    try {
      await updateData(`/api/users/invites`, {
        email: editingInviteFormData.email,
        role: editingInviteFormData.role,
      });
      toast.success("Invited user updated successfully!");
      closeEditModal();
      getData();
    } catch (err) {
      toast.error(err.message || "Failed to update invited user.");
    }
  };

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("email");
  const filtered = useFilteredData(data, filters);
  const sortedInvites = useSortedData(filtered, sortConfig);

  const columns = [
    {
      key: "email",
      label: "Email",
      span: 4,
    },
    {
      key: "role",
      label: "Role",
      span: 2,
    },
    {
      key: "status",
      label: "Status",
      span: 3,
      render: (item) => (
        <span
          className={`py-1 px-3 rounded-md capitalize ${
            item.status === "accepted" ? "bg-success" : "bg-warning"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const renderActions = (item) => (
    <>
      <button
        className="btn btn-xs btn-ghost"
        title="Edit"
        onClick={() => openEditModal(item)}
      >
        <Pencil size={16} />
      </button>
      <button
        className="btn btn-xs btn-ghost text-error"
        title="Delete"
        onClick={() => openDeleteModal(item)}
      >
        <Trash2 size={16} />
      </button>
    </>
  );

  const filterComponents = {
    searchFields: [{ key: "email", label: "Email", span: 3 }],
    dropdown: [
      {
        name: "Role",
        field: "role",
        options: invitedRoles,
        span: 2,
      },
      {
        name: "Status",
        field: "status",
        options: invitedStatuses,
        span: 2,
      },
    ],
  };

  if (loading) return <Loader message="Loading..." />;
  if (sortedInvites?.length === 0) return <div>No invited users found</div>;

  return (
    <section className="space-y-6">
      {/* Page Header with Invite Button */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Invited Users</h1>
        <div className="flex gap-4 flex-wrap self-end">
          <button className="btn btn-primary" onClick={openInviteModal}>
            <Plus size={16} /> Invite User
          </button>
          <button
            className="btn btn-ghost border border-base-300"
            onClick={() =>
              setFilters({
                email: "",
                role: "",
                status: "",
              })
            }
          >
            Clear All
          </button>
        </div>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      <div className="text-sm text-gray-500">
        Showing {sortedInvites.length} of {data.length} invited user(s)
      </div>

      <DataTable
        data={sortedInvites}
        sortHandlers={{ handleSort, getSortIcon }}
        columns={columns}
        renderActions={renderActions}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteInvitedUser}
        title="Confirm Delete"
        message={
          <div>
            Are you sure you want to delete invited user{" "}
            <strong>{invitedUserToDelete?.email}</strong>?
          </div>
        }
        confirmText="Yes, Delete"
        confirmBtnClass="btn-error"
        modalId="delete-invited-user-modal"
      />

      <InputModal
        isOpen={inviteModalOpen}
        onClose={closeInviteModal}
        modalId="invite-user-modal"
        title="Invite a New User"
        onSubmit={handleInviteSubmit}
        submitText="Send Invitation"
        error={inviteError}
        children={
          <>
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={inviteFormData.email}
                onChange={handleInviteFormChange}
                placeholder="user@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control my-4">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={inviteFormData.role}
                onChange={handleInviteFormChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>
          </>
        }
      />

      {editingInviteFormData && (
        <InputModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          modalId="edit-invited-user-modal"
          title={`Edit Invited User: ${editingInviteFormData.email}`}
          onSubmit={handleEditSubmit}
          submitText="Update User"
          error={editError}
          children={
            <>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Email (Read-only)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingInviteFormData.email}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="form-control my-4">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  name="role"
                  value={editingInviteFormData.role}
                  onChange={handleEditFormChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </>
          }
        />
      )}
    </section>
  );
};

export default Invites;
