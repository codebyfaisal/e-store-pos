# E-Store POS

A modern, full-stack Point-of-Sale (POS) and inventory management system designed for e-commerce businesses. This application provides a comprehensive solution for managing products, sales, customers, and user roles, with a robust reporting suite to track business performance.

### ✨ Features

The E-Store POS system is built with a rich set of features to handle all aspects of store management:

  * **Dashboard**: A dynamic overview of key performance indicators (KPIs) and recent activity.
  * **Inventory Management**: Manage products, brands, and categories with detailed tracking of stock levels and pricing.
  * **Sales & Orders**: Handle customer orders, process invoices, and manage sales returns.
  * **User & Customer Management**: Manage staff user accounts with role-based access control and maintain a database of customers.
  * **Comprehensive Reports**: Generate detailed reports on sales, inventory, and profit & loss to gain insights into business operations.

-----

### 💻 Tech Stack

The application is built as a monolithic application with a clear separation of frontend and backend concerns.

**Frontend:**

  * **Framework**: React.js
  * **State Management**: Zustand
  * **Styling**: Tailwind CSS, DaisyUI
  * **Routing**: React Router
  * **Build Tool**: Vite

**Backend:**

  * **Framework**: Node.js, Express
  * **Database**: PostgreSQL
  * **Authentication**: JSON Web Tokens (JWT) with `bcrypt` for password hashing.
  * **Security**: `helmet` and `cors` middleware, with `arcjet` for rate limiting and bot detection.

-----

### 🚀 Getting Started

To run this project locally, follow these steps:

**1. Clone the repository:**

```bash
git clone https://github.com/codebyfaisal/e-store-pos.git
cd e-store-pos
```

**2. Backend Setup:**

  * Navigate to the `backend` directory.
  * Install dependencies:
    ```bash
    npm install
    ```
  * Set up your PostgreSQL database and update the connection string in the `.env` file (see `backend/src/config/env.config.js`).
  * Start the backend server:
    ```bash
    npm run dev
    ```
    The server will run at `http://localhost:5000` by default.

**3. Frontend Setup:**

  * Navigate to the `frontend` directory.
  * Install dependencies:
    ```bash
    npm install
    ```
  * Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:5173` by default.

-----

### 📂 Project Structure

```
├── backend
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config
│   │   │   ├── env.config.js
│   │   │   └── supabaseClient.config.js
│   │   ├── controllers
│   │   │   ├── brand.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── invoice.controller.js
│   │   │   ├── orders.controller.js
│   │   │   ├── products.controller.js
│   │   │   ├── reports.controller.js
│   │   │   ├── salesReturns.controller.js
│   │   │   └── user.controllers
│   │   │       ├── admin.user.controller.js
│   │   │       ├── auth.user.controller.js
│   │   │       ├── bootstrap.controller.js
│   │   │       ├── invite.user.controller.js
│   │   │       └── profile.user.controller.js
│   │   ├── initDb.js
│   │   ├── lib
│   │   │   └── arcjet.lib.js
│   │   ├── middlewares
│   │   │   ├── arcjet.middleware.js
│   │   │   └── auth.middleware.js
│   │   ├── roles
│   │   │   └── users.roles.js
│   │   ├── routes
│   │   │   ├── brand.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── index.js
│   │   │   ├── invoice.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── report.routes.js
│   │   │   ├── salesReturn.routes.js
│   │   │   ├── user
│   │   │   └── user.routes.js
│   │   │       ├── admin.routes.js
│   │   │       ├── auth.routes.js
│   │   │       ├── invites.routes.js
│   │   │       └── profile.routes.js
│   │   ├── services
│   │   │   └── auth.service.js
│   │   ├── sql
│   │   │   ├── data.sql
│   │   │   └── db.sql
│   │   └── utils
│   │       ├── bcrypt.utils.js
│   │       ├── jwt.utils.js
│   │       ├── pdf-html.utils.js
│   │       ├── response.utils.js
│   │       └── verifyAndAttachUserToken.js
│   └── vercel.json
└── frontend
    ├── eslint.config.js
    ├── index.html
    ├── jsconfig.json
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   └── pdf.svg
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ThemeToggler.jsx
    │   │   ├── index.js
    │   │   ├── reports
    │   │   │   ├── ChartCard.jsx
    │   │   │   ├── KpiStats.jsx
    │   │   │   ├── ReportDataTable.jsx
    │   │   │   └── ReportHeader.jsx
    │   │   └── ui
    │   │       ├── ConfirmModal.jsx
    │   │       ├── DataTable.jsx
    │   │       ├── ErrorBoundary.jsx
    │   │       ├── InputModal.jsx
    │   │       ├── Loader.jsx
    │   │       ├── Modal.jsx
    │   │       ├── NoItemError.jsx
    │   │       └── filters
    │   │           ├── Filters.jsx
    │   │           └── ReportFilters.jsx
    │   ├── hooks
    │   │   ├── index.js
    │   │   ├── useCrudModals.js
    │   │   ├── useFilteredData.js
    │   │   ├── useSortConfig.jsx
    │   │   └── useSortedData.js
    │   ├── index.css
    │   ├── layouts
    │   │   ├── AuthLayout.jsx
    │   │   ├── MainLayout.jsx
    │   │   └── index.js
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── Brands.jsx
    │   │   ├── Categories.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Forbidden.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── Orders.jsx
    │   │   ├── SalesReturn.jsx
    │   │   ├── accounts
    │   │   │   ├── Customers.jsx
    │   │   │   ├── Invites.jsx
    │   │   │   └── Users.jsx
    │   │   ├── auth
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── index.js
    │   │   ├── invoices
    │   │   │   ├── InvoiceDetails.jsx
    │   │   │   └── Invoices.jsx
    │   │   ├── products
    │   │   │   ├── AddProduct.jsx
    │   │   │   ├── EditProduct.jsx
    │   │   │   └── Products.jsx
    │   │   ├── reports
    │   │   │   ├── AnnualReport.jsx
    │   │   │   ├── InventoryReport.jsx
    │   │   │   ├── ProfitAndLossReport.jsx
    │   │   │   └── SalesReport.jsx
    │   │   └── user
    │   │       ├── Activities.jsx
    │   │       ├── Profile.jsx
    │   │       └── Security.jsx
    │   ├── services
    │   │   └── api.js
    │   ├── store
    │   │   ├── index.js
    │   │   ├── useApiDataStore.js
    │   │   ├── useAuthStore.js
    │   │   ├── useReportStore.js
    │   │   └── useSidebarStore.js
    │   └── utils
    │       ├── getEntityStats.js
    │       └── normalizeDate.js
    ├── vercel.json
    └── vite.config.js
```