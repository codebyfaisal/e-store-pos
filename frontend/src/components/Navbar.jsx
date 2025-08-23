import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/index.js";
import { Bell, ListMinus } from "lucide-react";
import { ThemeToggler } from "@/components/index.js";

function Navbar({ sidebarToggle }) {
  const { logout, user, notifications } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={`w-full sticky z-[999]`}>
      <div className="navbar pl-2.5 pr-4 md:pl-4.5 md:pr-5.5 lg:pl-5 lg:pr-4.5 bg-base-100 justify-between h-17">
        <h1 className="font-bold text-2xl text-primary cursor-pointer">
          E - Store
        </h1>
        <h1 className="text-xl font-[501] text-primary hidden lg:block">
          Welcome {user?.name}
        </h1>
        <div className="flex gap-4 items-center">
          <ThemeToggler />

          <div className="dropdown dropdown-end">
            <div className="relative cursor-pointer" tabIndex={0} role="button">
              <span className="absolute -top-1 -right-0.5 bg-red-600 rounded-full text-[0.6rem] w-4 h-4 text-center flex justify-center items-center text-white">
                {notifications.length ?? 0}
              </span>
              <Bell />
            </div>
            <div
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-1 w-max max-w-xs -translate-x-4 shadow gap-2 p-4"
            >
              {notifications.map((not, i) => (
                <div
                  key={i}
                  className={`grid border-base-300 gap-1 mb-2 pb-2 ${
                    notifications.length - 1 === i ? "border-0" : "border-b"
                  }`}
                >
                  <span className="font-bold">{not.event_type}</span>
                  <span>{not.message}</span>
                </div>
              ))}
              {location.pathname !== "/user/activities" && (
                <Link className="btn btn-primary" to="/user/activities">
                  View All
                </Link>
              )}
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar rounded-full"
            >
              <div className="w-14 rounded-full border-primary">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-max px-3 py-4 space-y-1 -translate-x-4 shadow"
            >
              <li>
                <Link to="/user/profile" className="text-right justify-end ">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/user/security" className="text-right justify-end ">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/user/activities" className="text-right justify-end ">
                  Activities
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-right justify-end"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <div className="flex">
            <button
              style={{
                boxShadow: "none",
              }}
              onClick={sidebarToggle}
            >
              <ListMinus className="transition-transform duration-300 cursor-pointer lg:hidden" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
