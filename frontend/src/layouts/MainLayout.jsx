import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Navbar } from "@/components/index.js";

const MainLayout = () => {
  const [largeScreen, setLargeScreen] = useState(window.innerWidth > 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setLargeScreen(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar sidebarToggle={(tg) => setIsSidebarOpen((prev) => tg || !prev)} />

      {/* Main Content */}
      <div className={`h-full flex lg:relative`}>
        {/* Sidebar */}
        <Sidebar
          sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          largeScreen={largeScreen}
        />

        {/* Main Area for nested routes */}
        <main className="w-full h-full flex-1 px-2.5 py-4 md:px-4 lg:p-6 relative overflow-y-scroll flex flex-col justify-between">
          <Outlet />

          {/* Footer */}
          <div>
            <hr className="border-base-content/20 mt-10 mb-5" />
            <div className="text-sm flex justify-between h-[12vh]">
              <p>2025 © E-Store. All Right Reserved</p>
              <p>
                Designed & Developed by{" "}
                <a
                  href="https://codebyfaisal.netlify.app"
                  className="text-primary font-bold"
                  target="_blank"
                >
                  Codebyfaisal
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
