import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
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
import normalizeDate from "@/utils/normalizeDate";

const Users = () => {
  const [searchParams] = useSearchParams();

  const { fetchData, deleteData, updateData } = useApiDataStore();

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    role: searchParams.get("role") || "",
    fromDate:
      normalizeDate(
        searchParams.get("from date") || searchParams.get("from-date"),
        "YYYY-MM-DD"
      ) || "",
    toDate:
      normalizeDate(
        searchParams.get("to date") || searchParams.get("to-date"),
        "YYYY-MM-DD"
      ) || "",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUserFormData, setEditingUserFormData] = useState(null);
  const [originalEditingRole, setOriginalEditingRole] = useState(null);
  const [editError, setEditError] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/users/admin");
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

  const users = Array.isArray(data)
    ? data.map((user) => ({
        ...user,
        name: `${user.fname} ${user.lname}`,
      }))
    : [];

  const userRoles = [
    ...new Set(users.map((user) => user.role).filter(Boolean)),
  ];

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("created_at");
  const filtered = useFilteredData(users, filters);
  const sortedUsers = useSortedData(filtered, sortConfig);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteData(`/api/users/${userToDelete.user_id}`);
      toast.success("User deleted successfully!");
      getData();
    } catch (err) {
      toast.error("Error deleting user.");
    } finally {
      closeDeleteModal();
    }
  };

  const openEditModal = (user) => {
    setEditingUserFormData({ ...user });
    setOriginalEditingRole(user.role);
    setEditModalOpen(true);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUserFormData(null);
    setOriginalEditingRole(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingUserFormData((prev) => ({ ...prev, [name]: value }));
    if (editError) setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editingUserFormData?.email || !editingUserFormData?.role) {
      setEditError("Email and role are required.");
      return;
    }

    if (editingUserFormData.role === originalEditingRole) {
      closeEditModal();
      return;
    }

    try {
      await updateData(`/api/users`, {
        email: editingUserFormData.email,
        role: editingUserFormData.role,
      });
      toast.success("User role updated successfully!");
      closeEditModal();
      getData();
    } catch (err) {
      toast.error(err.message || "Failed to update user role.");
    }
  };

  const columns = [
    {
      key: "user_id",
      label: "#",
      span: 1,
    },
    {
      key: "name",
      label: "Name",
      span: 3,
    },
    {
      key: "email",
      label: "Email",
      span: 3,
    },
    {
      key: "role",
      label: "Role",
      span: 2,
    },
    {
      key: "created_at",
      label: "Created At",
      span: 1,
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  const renderActions = (item) => (
    <>
      <button
        className="btn btn-xs btn-ghost"
        title="Edit Role"
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
    searchFields: [
      { key: "name", label: "Name", span: 2 },
      { key: "email", label: "Email", span: 2 },
    ],
    dropdown: [
      {
        name: "Role",
        field: "role",
        options: userRoles,
        span: 2,
      },
    ],
    timeRange: {
      span: 2,
    },
  };

  if (loading) return <Loader message="Loading..." />;
  if (users?.length === 0) return <div>No users found</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <button
          className="btn btn-ghost border border-base-300"
          onClick={() =>
            setFilters({
              name: "",
              email: "",
              role: "",
              fromDate: "",
              toDate: "",
            })
          }
        >
          Clear All
        </button>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      <div className="text-sm text-gray-500">
        Showing {sortedUsers.length} of {users.length} user(s)
      </div>

      <DataTable
        data={sortedUsers}
        sortHandlers={{ handleSort, getSortIcon }}
        columns={columns}
        renderActions={renderActions}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        title="Confirm Delete"
        message={
          <div>
            Are you sure you want to delete{" "}
            <strong>{userToDelete?.name}</strong>?
          </div>
        }
        confirmText="Yes, Delete"
        confirmBtnClass="btn-error"
        modalId="delete-user-modal"
      />

      {editingUserFormData && (
        <InputModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          modalId="edit-user-role-modal"
          title={`Edit User Role: ${editingUserFormData.email}`}
          onSubmit={handleEditSubmit}
          submitText="Update Role"
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
                  value={editingUserFormData.email}
                  className="input input-bordered w-full"
                  disabled // Email is read-only for editing
                />
              </div>
              <div className="form-control my-4">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  name="role"
                  value={editingUserFormData.role}
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

export default Users;
