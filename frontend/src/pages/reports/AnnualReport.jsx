import { useEffect, useState } from "react";
import {
  ChartCard,
  KpiStats,
  ReportHeader,
  Loader,
} from "@/components/index.js";
import { useApiDataStore } from "@/store/index.js";

const AnnualReport = () => {
  const { fetchData } = useApiDataStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/reports/annual");
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

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Annual reports found</div>;

  const {
    totalSales = 0,
    totalOrders = 0,
    totalRevenue = 0,
    totalReturns = 0,
    invoiceStats = { paid: 0, unpaid: 0 },
    monthlyRevenue = [],
    monthlyOrders = [],
    categorySales = [],
    brandSales = [],
  } = data || {};

  return (
    <section className="space-y-4">
      <ReportHeader title="Annual Business Report" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <KpiStats title="Total Sales" value={totalSales} />
        <KpiStats title="Total Orders" value={totalOrders} />
        <KpiStats title="Revenue" value={totalRevenue} format="currency" />
        <KpiStats title="Returns" value={totalReturns} />
        <KpiStats title="Paid Invoices" value={invoiceStats.paid} />
        <KpiStats title="Unpaid Invoices" value={invoiceStats.unpaid} />
      </div>
      <ChartCard
        title="Sales by Category"
        chartType="Bar"
        data={{
          labels: categorySales.map((c) => c.name),
          datasets: [
            {
              label: "Sales by Category",
              data: categorySales.map((c) => c.total),
              backgroundColor: ["#1FB2A6", "#3B82F6", "#FBBF24", "#EF4444"],
            },
          ],
        }}
      />
      <ChartCard
        title="Sales by Brand"
        chartType="Bar"
        data={{
          labels: brandSales.map((b) => b.name),
          datasets: [
            {
              label: "Sales by Brand",
              data: brandSales.map((b) => b.total),
              backgroundColor: "#6366F1",
            },
          ],
        }}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard
          title="Revenue Over Months"
          chartType="Line"
          data={{
            labels: monthlyRevenue.map((m) => m.month),
            datasets: [
              {
                label: "Revenue",
                data: monthlyRevenue.map((m) => m.amount),
                borderColor: "#3B82F6",
                fill: false,
              },
            ],
          }}
        />
        <ChartCard
          title="Order Volume Over Months"
          chartType="Line"
          data={{
            labels: monthlyOrders.map((m) => m.month),
            datasets: [
              {
                label: "Orders",
                data: monthlyOrders.map((m) => m.count),
                borderColor: "#10B981",
                fill: false,
              },
            ],
          }}
        />
      </div>
    </section>
  );
};

export default AnnualReport;
