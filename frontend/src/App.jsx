import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout, MainLayout } from "@/layouts/index.js";
import {
  ErrorBoundary,
  Loader,
  PrivateRoute,
  ThemeToggler,
} from "@/components/index.js";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store";

const Register = lazy(() => import("@/pages/auth/Register.jsx"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Products = lazy(() => import("@/pages/products/Products"));
const EditProduct = lazy(() => import("@/pages/products/EditProduct"));
const AddProduct = lazy(() => import("@/pages/products/AddProduct"));
const Categories = lazy(() => import("@/pages/Categories"));
const Brands = lazy(() => import("@/pages/Brands"));
const Orders = lazy(() => import("@/pages/Orders"));
const SalesReturn = lazy(() => import("@/pages/SalesReturn"));
const Invoices = lazy(() => import("@/pages/invoices/Invoices"));
const InvoiceDetails = lazy(() => import("@/pages/invoices/InvoiceDetails"));
const Users = lazy(() => import("@/pages/accounts/Users"));
const SalesReport = lazy(() => import("@/pages/reports/SalesReport"));
const InventoryReport = lazy(() => import("@/pages/reports/InventoryReport"));
const ProfitAndLossReport = lazy(() =>
  import("@/pages/reports/ProfitAndLossReport")
);
const AnnualReport = lazy(() => import("@/pages/reports/AnnualReport"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const Customers = lazy(() => import("@/pages/accounts/Customers"));
const InvitedUsers = lazy(() => import("@/pages/accounts/Invites"));
const Security = lazy(() => import("@/pages/user/Security"));
const Activities = lazy(() => import("@/pages/user/Activities"));
const Forbidden = lazy(() => import("@/pages/Forbidden"));

function App() {
  const {isAuthenticated} = useAuthStore();
  return (
    <ErrorBoundary>
      <div className="h-screen w-full bg-base-200">
        <div className={` ${!isAuthenticated ? "absolute top-4 right-4 z-[100000000]" : "hidden"}`}>
          <ThemeToggler />
        </div>
        <Toaster position="top-right" />
        <div className="h-screen w-full bg-base-200 z-[10]">
          <Routes>
            {/* Public Routes - Uses AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <Suspense fallback={<Loader message="Loading Login..." />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<Loader message="Loading Register..." />}>
                    <Register />
                  </Suspense>
                }
              />
            </Route>

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/dashboard"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Dashboard..." />}
                    >
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Products..." />}
                    >
                      <Products />
                    </Suspense>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Product..." />}
                    >
                      <EditProduct />
                    </Suspense>
                  }
                />
                <Route
                  path="/products/new"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Add Product..." />}
                    >
                      <AddProduct page="Create" />
                    </Suspense>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Edit Product..." />}
                    >
                      <AddProduct page="Edit" />
                    </Suspense>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Categories..." />}
                    >
                      <Categories />
                    </Suspense>
                  }
                />
                <Route
                  path="/brands"
                  element={
                    <Suspense fallback={<Loader message="Loading Brands..." />}>
                      <Brands />
                    </Suspense>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Suspense fallback={<Loader message="Loading Orders..." />}>
                      <Orders />
                    </Suspense>
                  }
                />
                <Route
                  path="/sales-returns"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Sales Returns..." />}
                    >
                      <SalesReturn />
                    </Suspense>
                  }
                />
                <Route
                  path="/invoices"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Invoices..." />}
                    >
                      <Invoices />
                    </Suspense>
                  }
                />
                <Route
                  path="/invoices/:id"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Invoice Details..." />}
                    >
                      <InvoiceDetails />
                    </Suspense>
                  }
                />
                <Route
                  path="/accounts/customers"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Customers..." />}
                    >
                      <Customers />
                    </Suspense>
                  }
                />
                <Route
                  path="/accounts/users"
                  element={
                    <Suspense fallback={<Loader message="Loading Users..." />}>
                      <Users />
                    </Suspense>
                  }
                />
                <Route
                  path="/accounts/invites"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Invited Users..." />}
                    >
                      <InvitedUsers />
                    </Suspense>
                  }
                />
                <Route
                  path="/reports/sales"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Sales Report..." />}
                    >
                      <SalesReport />
                    </Suspense>
                  }
                />
                <Route
                  path="/reports/inventory"
                  element={
                    <Suspense
                      fallback={
                        <Loader message="Loading Inventory Report..." />
                      }
                    >
                      <InventoryReport />
                    </Suspense>
                  }
                />
                <Route
                  path="/reports/profit-loss"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading P&L Report..." />}
                    >
                      <ProfitAndLossReport />
                    </Suspense>
                  }
                />
                <Route
                  path="/reports/annual"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Annual Report..." />}
                    >
                      <AnnualReport />
                    </Suspense>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Profile..." />}
                    >
                      <Profile />
                    </Suspense>
                  }
                />
                <Route
                  path="/user/security"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Security..." />}
                    >
                      <Security />
                    </Suspense>
                  }
                />
                <Route
                  path="/user/activities"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading Activities..." />}
                    >
                      <Activities />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            {/* Optional 404 Fallback */}
            <Route
              path="/403"
              element={
                <Suspense fallback={<Loader message="Loading" />}>
                  <Forbidden />
                </Suspense>
              }
            />
            <Route
              path="/404"
              element={
                <Suspense fallback={<Loader message="Loading" />}>
                  <NotFound />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<Loader message="Loading..." />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
