import { useEffect, useState } from "react";
import {
  ChartCard,
  KpiStats,
  ReportDataTable,
  ReportHeader,
  Loader,
} from "@/components/index.js";
import { useApiDataStore } from "@/store/index.js";

const SalesReport = () => {
  const { fetchData } = useApiDataStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/reports/sales");
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

  const {
    kpiStats,
    topProducts,
    salesOverTime,
    revenueByPaymentMethod,
    salesByCustomer,
    salesReturns,
  } = data;

  const ensureArray = (item) =>
    item ? (Array.isArray(item) ? item : [item]) : [];

  const salesOverTimeArr = ensureArray(salesOverTime);
  const topProductsArr = ensureArray(topProducts);
  const revenueByPaymentMethodArr = ensureArray(revenueByPaymentMethod);
  const salesByCustomerArr = ensureArray(salesByCustomer);
  const salesReturnsArr = ensureArray(salesReturns);

  if (loading) return <Loader message="Loading..." />;
  if (loading) return <div>Loading...</div>;

  return (
    <section className="space-y-4">
      <ReportHeader title="Sales Report" />

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
        <KpiStats
          title="Total Sales"
          value={parseFloat(kpiStats?.sales) || 0}
          format="currency"
        />
        <KpiStats title="Orders" value={parseInt(kpiStats?.orders, 10) || 0} />
        <KpiStats
          title="Products Sold"
          value={parseInt(kpiStats?.products_sold, 10) || 0}
        />
        <KpiStats
          title="Invoices Paid"
          value={parseInt(kpiStats?.invoices_paid, 10) || 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard
          title="Sales Over Time"
          chartType="Line"
          data={{
            labels: salesOverTimeArr.map((s) => s.month),
            datasets: [
              {
                label: "Sales ($)",
                data: salesOverTimeArr.map((s) => parseFloat(s.sales)),
                borderColor: "#4F46E5",
                fill: false,
              },
            ],
          }}
        />

        <ChartCard
          title="Revenue by Payment Method"
          chartType="Bar"
          data={{
            labels: revenueByPaymentMethodArr.map((r) => r.method),
            datasets: [
              {
                label: "Revenue",
                data: revenueByPaymentMethodArr.map((r) =>
                  parseFloat(r.revenue)
                ),
                backgroundColor: "#3B82F6",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { x: { stacked: true }, y: { stacked: true } },
          }}
        />
      </div>

      <ReportDataTable
        title="Top Selling Products"
        headers={["Product", "Quantity Sold", "Revenue ($)"]}
        data={topProductsArr}
        renderRow={(p, i) => (
          <tr key={i}>
            <td>{p.name}</td>
            <td>{parseInt(p.quantity, 10)}</td>
            <td>${parseFloat(p.revenue).toLocaleString()}</td>
          </tr>
        )}
      />

      <ReportDataTable
        title="Sales by Customer"
        headers={["Customer", "Total Sales ($)"]}
        data={salesByCustomerArr}
        renderRow={(c, i) => (
          <tr key={i}>
            <td>{c.customer}</td>
            <td>${parseFloat(c.total).toLocaleString()}</td>
          </tr>
        )}
      />

      <ReportDataTable
        title="Sales Returns"
        headers={["Reason", "Count"]}
        data={salesReturnsArr}
        renderRow={(r, i) => (
          <tr key={i}>
            <td>{r.reason}</td>
            <td>{parseInt(r.count, 10)}</td>
          </tr>
        )}
      />
    </section>
  );
};

export default SalesReport;
