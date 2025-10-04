import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/index.js";
import api from "@/services/api.js";

const Login = () => {
  const [form, setForm] = useState({ email: "faisal@gmail.com", password: "1234" });
  const { isLoginLoading, setIsLoginLoading, isAuthenticated } = useAuthStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/users/auth/login", form);

      if (response?.data?.success) {
        useAuthStore.getState().login();
        toast.success("Login successful!");
        navigate("/");
      } else {
        setError(response.data?.message || "Login failed.");
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      toast.error(
        err.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <section className="flex items-center justify-center bg-base-200 w-full min-h-screen">
      <div className="card w-full max-w-sm bg-base-100 shadow">
        <div className="card-body space-y-8">
          <h2 className="card-title text-3xl justify-center">Login</h2>

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
                disabled={isLoginLoading}
              >
                {isLoginLoading
                  ? "Logging in..."
                  : (error && "Login failed") || "Login"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-2">
            Don’t have an account?{" "}
            <Link to="/register" className="link-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
