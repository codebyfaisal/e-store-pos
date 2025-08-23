import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutPanelLeft, CirclePlus, ChartBarStacked, Badge, CornerDownRight, Receipt, UserCircle2Icon, BarChart, Database, CircleDollarSign,  ClipboardMinus, ShieldCheck, ListOrdered, Users2, UserPlus, User, Bell, ArrowLeft, X, Folder, FileText, Box, PackageOpen, File } from "lucide-react";
import { useAuthStore } from "../store/index.js";

const navigation = [
  {
    dashboard: [
      { path: "dashboard", icon: LayoutPanelLeft, label: "Dashboard" },
    ],
    icon: LayoutPanelLeft,
  },
  {
    inventory: [
      { path: "products", icon: PackageOpen, label: "Products" },
      { path: "products/new", icon: CirclePlus, label: "New Product" },
      { path: "categories", icon: ChartBarStacked, label: "Categories" },
      { path: "brands", icon: Badge, label: "Brands" },
    ],
    icon: Box,
  },
  {
    sales: [
      { path: "orders", icon: ListOrdered, label: "Orders" },
      { path: "invoices", icon: FileText, label: "Invoices" },
      { path: "sales-returns", icon: CornerDownRight, label: "Sales Return" },
    ],
    icon: Receipt,
  },
  {
    Accounts: [
      { path: "accounts/users", icon: Users2, label: "Users" },
      { path: "accounts/invites", icon: UserPlus, label: "Invites" },
      { path: "accounts/customers", icon: UserCircle2Icon, label: "Customers" },
    ],
    icon: Folder,
  },
  {
    reports: [
      { path: "reports/sales", icon: BarChart, label: "Sales Report" },
      { path: "reports/inventory", icon: Database, label: "Inventory Report" },
      {
        path: "reports/profit-loss",
        icon: CircleDollarSign,
        label: "Profit & Loss",
      },
      { path: "reports/annual", icon: ClipboardMinus, label: "Annual Report" },
    ],
    icon: File,
  },
  {
    User: [
      { path: "user/profile", icon: User, label: "Profile" },
      { path: "user/activities", icon: Bell, label: "Activities" },
      { path: "user/security", icon: ShieldCheck, label: "Security" },
    ],
    icon: ShieldCheck,
  },
];

const MenuItem = ({ path, Icon, label, isSidebarOpen, isDashboard }) => (
  <NavLink
    to={`/${path}`}
    end={path.split("/").length === 1}
    className={({ isActive }) =>
      [
        "flex items-center gap-2 text-[0.95rem] min-h-[35px] hover:text-base-content hover:bg-base-300 rounded-lg transition-all duration-200 group",
        !isActive && "opacity-40",
        isActive && "bg-primary text-primary-content opacity-100",
        isDashboard && !isSidebarOpen && "px-2",
        !isDashboard && !isSidebarOpen && "px-2",
        !isDashboard && isSidebarOpen && "px-4",
        isActive && isDashboard && "pl-2"
      ]
        .filter(Boolean)
        .join(" ")
    }
  >
    <div className="min-w-[20px]">
      <Icon size={20} />
    </div>
    <span
      className={`transition-all duration-300 whitespace-nowrap overflow-hidden capitalize group-hover:visible group-hover:opacity-100 ${
        isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {label}
    </span>
  </NavLink>
);

function Sidebar({ isSidebarOpen, sidebarToggle, largeScreen }) {
  const location = useLocation();
  const { permissions } = useAuthStore();
  const [activeGroup, setActiveGroup] = useState(null);

  function filterNavigation(navData, userPermissions) {
    return navData
      .map((section) => {
        const keys = Object.keys(section);
        const sectionName = keys.find((k) => k !== "icon");
        const items = section[sectionName];
        const icon = section.icon;

        const filteredItems = items.filter((item) =>
          userPermissions.includes(item.path)
        );

        if (sectionName === "User") return { [sectionName]: items, icon };
        if (filteredItems.length > 0)
          return { [sectionName]: filteredItems, icon };

        return null;
      })
      .filter(Boolean);
  }

  const filteredNavigation = filterNavigation(navigation, permissions);

  useEffect(() => {
    let currentPath = location.pathname.slice(1);
    for (const section of filteredNavigation) {
      const sectionName = Object.keys(section).find((k) => k !== "icon");
      const links = section[sectionName];
      const isPathInGroup = links.some((link) =>
        currentPath.startsWith(link.path)
      );
      if (isPathInGroup) {
        setActiveGroup(sectionName);
        return;
      }
    }
    setActiveGroup(null);
  }, [location.pathname, filteredNavigation]);

  return (
    <aside
      className={`flex flex-col absolute top-0 -left-100 z-[1004] w-full h-full transition-all duration-300 bg-base-300/30 group [&>*]:transition-all [&>*]:duration-300
        lg:static
        ${!largeScreen && isSidebarOpen ? "left-0" : "-left-full"}
        ${largeScreen && !isSidebarOpen ? "lg:w-20" : "lg:w-60"}`}
    >
      {/* Header */}
      <div className="h-17 w-full relative bg-base-100 max-w-xs lg:h-auto lg:bg-transparent flex items-center justify-between pl-3 pr-6">
        <h1 className="font-bold text-2xl text-primary lg:hidden">E - Store</h1>
        <button
          onClick={() => sidebarToggle(false)}
          className={`hidden lg:block absolute top-0 right-0 translate-1/2 -translate-y-1/2 z-[100] bg-primary rounded-full p-1 transition-all duration-300 cursor-pointer ${
            isSidebarOpen ? "" : "scale-[-1]"
          }`}
          style={{ boxShadow: "none" }}
        >
          <ArrowLeft size={10} color="#fff" />
          <ArrowLeft size={10} color="#fff" />
        </button>
        <button
          onClick={() => sidebarToggle(false)}
          className="lg:hidden"
          style={{ boxShadow: "none" }}
        >
          <X size={24} className="cursor-pointer" />
        </button>
      </div>

      {/* Menu List */}
      <div className="h-max pb-14 pt-7 flex-1 bg-base-100 px-3 max-w-xs lg:pl-5.5 relative overflow-scroll">
        <div className="flex flex-col gap-2">
          {filteredNavigation.map((section, index) => {
            const sectionName = Object.keys(section).find((k) => k !== "icon");
            const links = section[sectionName];
            const SectionIcon = section.icon;
            const isActive = activeGroup === sectionName;

            if (sectionName === "dashboard") {
              const { path, icon, label } = links[0];
              return (
                <MenuItem
                  key={path}
                  path={path}
                  Icon={icon}
                  label={label}
                  isSidebarOpen={isSidebarOpen}
                  isDashboard={true}
                />
              );
            }

            return (
              <div className="collapse collapse-plus" key={index}>
                <input type="checkbox" className="min-h-0" />
                <div
                  className={`collapse-title font-semibold capitalize min-h-0 px-0 py-1 flex items-center gap-2 ${
                    isActive ? "text-primary text-lg" : "text-sm"
                  } ${isSidebarOpen ? "" : "pl-2"}`}
                >
                  {SectionIcon && <SectionIcon size={isActive ? 20 : 18} />}
                  <span
                    className={`${isSidebarOpen ? "visible" : "invisible"}`}
                  >
                    {sectionName}
                  </span>
                </div>
                <div
                  className="collapse-content max-w-6/7"
                  style={{ padding: "0" }}
                >
                  <ul className="flex flex-col gap-1">
                    {links.map(({ path, icon, label }) => (
                      <li key={path}>
                        <MenuItem
                          path={path}
                          Icon={icon}
                          label={label}
                          isSidebarOpen={isSidebarOpen}
                          isDashboard={false}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
