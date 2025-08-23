import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useApiDataStore, useAuthStore } from "@/store/index.js";
import { Loader } from "@/components";

const Profile = () => {
  const { logout } = useAuthStore();
  const { fetchData, updateData } = useApiDataStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/users/profile");
    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;
    setData({ ...result[0] });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setFormData({
        fname: data.fname || "",
        lname: data.lname || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        fname: data.fname || "",
        lname: data.lname || "",
        email: data.email || "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      if (!formData.fname || !formData.lname || !formData.email)
        return toast.error("Please fill in all required fields.");

      if (
        formData.fname === data.fname &&
        formData.lname === data.lname &&
        formData.email === data.email
      ) {
        setIsEditing(false);
        return;
      }
      await updateData("/api/users/profile", formData);
      setIsEditing(false);
      await getData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile.");
    }
  };

  const handleLogout = async () => await logout();

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No user found</div>;

  return (
    <section className="flex items-center">
      <div className="bg-base-100 p-8 rounded shadow-xs max-w-3xl mx-auto md:min-w-96 grid gap-4">
        <div className="flex items-center">
          <img
            src={
              data?.avatarUrl ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            alt={`${data.fname} ${data.lname}`}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            {data.fname} {data.lname}
          </h1>
          <p className="text-base-content opacity-60 capitalize">{data.role}</p>
        </div>

        <div className="space-y-4">
          <div className="grid xs:flex gap-4">
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name:</span>
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="input input-bordered w-full"
                disabled={!isEditing} // Disabled when not editing
              />
            </div>

            {/* Last Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name:</span>
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="input input-bordered w-full"
                disabled={!isEditing} // Disabled when not editing
              />
            </div>
          </div>
          {/* Email Field (often read-only or requires special handling for changes) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={!isEditing}
            />
          </div>

          {/* Member Since (Read-only) */}
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-base-content">
              Member Since:
            </span>
            <span>{new Date(data.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary flex-grow p-0 m-0"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={handleEditToggle} className="btn btn-primary">
              Edit Profile
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-ghost text-error">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
