import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
import { useApiDataStore } from "@/store/index.js";
import { Loader } from "@/components";

const Dashboard = () => {
  const { fetchData } = useApiDataStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/dashboard");
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

  if (loading) return <Loader message="Loading..." />;
  if (!data || data?.length === 0 || !data[0]?.kpis) return null;

  const {
    kpis,
    weekly_sales,
    order_status,
    payment_methods,
    sales_comparison,
    top_products,
    recent_orders,
    top_customers,
  } = data[0];

  const { total_sales, total_orders, total_returns } = kpis || {};

  const weeklySalesLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklySalesData = weeklySalesLabels.map((day) => {
    const found = weekly_sales?.find((d) => d.day === day);
    return found ? parseFloat(found.amount) : 0;
  });

  const weekly_salesP = [
    { day: "Mon", amount: "1000.00" },
    { day: "Tue", amount: "500.00" },
    { day: "Wed", amount: "500.00" },
    { day: "Thu", amount: "1000.00" },
    { day: "Fri", amount: "1050.00" },
    { day: "Sat", amount: "240.00" },
    { day: "Sun", amount: "750.00" },
  ];
  const weeklySalesDataP = weeklySalesLabels.map((day) => {
    const found = weekly_salesP.find((d) => d.day === day);
    return found ? parseFloat(found.amount) : 0;
  });

  const weeklySalesChartData = {
    labels: weeklySalesLabels,
    datasets: [
      {
        label: "Weekly Sales",
        data: weeklySalesData,
        backgroundColor: "#3b82f6",
        borderRadius: 5,
      },
      {
        label: "Next Week Prediction",
        data: weeklySalesDataP,
        backgroundColor: "#bfff22",
        borderRadius: 5,
      },
    ],
  };

  const orderStatusLabels = order_status?.map((item) => item.status) || [];
  const orderStatusCounts =
    order_status?.map((item) => parseInt(item.count)) || [];

  const ordersStatusChartData = {
    labels: orderStatusLabels,
    datasets: [
      {
        label: "Order Statuses",
        data: orderStatusCounts,
        backgroundColor: [
          "#facc15",
          "#22c55e",
          "#ef4444",
          "#3b82f6",
          "#f19999",
          "#bfff22",
        ],
      },
    ],
  };

  const paymentMethodLabels = payment_methods?.map((item) => item.method) || [];
  const paymentMethodCounts =
    payment_methods?.map((item) => parseInt(item.count)) || [];
  const paymentMethodsChartData = {
    labels: paymentMethodLabels,
    datasets: [
      {
        label: "Payment Methods",
        data: paymentMethodCounts,
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
      },
    ],
  };

  const salesComparison = sales_comparison?.[0] || {
    current_week: "0",
    last_week: "0",
  };
  const salesComparisonPercent =
    salesComparison.last_week === "0"
      ? 100
      : ((parseFloat(salesComparison.current_week) -
          parseFloat(salesComparison.last_week)) /
          parseFloat(salesComparison.last_week)) *
        100;

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid xs:grid-cols-2 gap-4 col-span-2">
          <div className="stat bg-base-100 col-span-1 place-content-center gap-2">
            <div className="stat-title text-xl">Total Sales</div>
            <div className="stat-value text-primary">${total_sales}</div>
            <div className="stat-desc">
              {salesComparisonPercent >= 0
                ? `↑ ${salesComparisonPercent.toFixed(1)}% from last week`
                : `↓ ${Math.abs(salesComparisonPercent).toFixed(
                    1
                  )}% from last week`}
            </div>
          </div>
          <div className="stat bg-base-100 col-span-1 place-content-center gap-2">
            <div className="stat-title text-xl">Total Orders</div>
            <div className="stat-value">{total_orders}</div>
            <div className="stat-desc">Total orders placed</div>
          </div>
          <div className="stat bg-base-100 colspan-1 place-content-center gap-2">
            <div className="stat-title text-xl">Total Returns</div>
            <div className="stat-value text-secondary">{total_returns}</div>
            <div className="stat-desc">Orders returned</div>
          </div>
          <div className="stat bg-base-100 col-span-1 place-content-center gap-2">
            <div className="stat-title text-xl">Sales Comparison</div>
            <div className="stat-value">${salesComparison.current_week}</div>
            <div className="stat-desc">
              vs ${salesComparison.last_week} last week
            </div>
          </div>
        </div>
        <div className="card col-span-1 bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Payment Methods</h2>
            <Pie
              data={paymentMethodsChartData}
              options={{ responsive: true }}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Sales This Week</h2>
            <Bar data={weeklySalesChartData} />
          </div>
        </div>

        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Orders by Status</h2>
            <Bar data={ordersStatusChartData} />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Selling Products */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {top_products
                    ?.slice(0, 3)
                    ?.map(
                      ({ product_id, product_name, units_sold, revenue }) => (
                        <tr key={product_id}>
                          <td>{product_name}</td>
                          <td>{units_sold}</td>
                          <td>${revenue}</td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Buying Customers */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Top Buying Customers</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {top_customers
                    ?.slice(0, 3)
                    ?.map(({ customer_id, customer, orders, total_spent }) => (
                      <tr key={customer_id}>
                        <td>{customer}</td>
                        <td>{orders}</td>
                        <td>${total_spent}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="table w-full table-compact">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders
                  ?.slice(0, 5)
                  ?.map(({ order_id, customer, status, total_amount }) => (
                    <tr key={order_id}>
                      <td>#{order_id}</td>
                      <td>{customer}</td>
                      <td
                        className={
                          status === "Completed"
                            ? "text-success"
                            : status === "Pending"
                            ? "text-warning"
                            : "text-error"
                        }
                      >
                        {status}
                      </td>
                      <td>${total_amount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
