import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const backendApiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${backendApiUrl}/api/users/auth/register`,
        form,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("Registered successful!");
        navigate("/login");
        return;
      }
    } catch (err) {
      setError("Something went wrong.");
      toast.error(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center bg-base-200 w-full min-h-screen">
      <div className="card w-full max-w-sm bg-base-100 shadow">
        <div className="card-body space-y-8">
          <h2 className="card-title text-3xl justify-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                placeholder="e.g 8oK4G@example.com"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">First name</span>
              </label>
              <input
                type="text"
                name="fname"
                value={form.fname}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                placeholder="e.g John"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Last name</span>
              </label>
              <input
                type="text"
                name="lname"
                value={form.lname}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                placeholder="e.g Doe"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                placeholder="e.g 3$d4Y67dt(0"
              />
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn w-full ${
                  !error ? "btn-primary" : "btn-error text-base-300"
                }`}
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : (error && "Registration failed") || "Register"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login" className="link-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
