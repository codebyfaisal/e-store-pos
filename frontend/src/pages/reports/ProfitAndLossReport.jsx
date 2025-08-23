import { useEffect, useState } from "react";
import {
  ChartCard,
  KpiStats,
  ReportDataTable,
  ReportHeader,
  Loader,
} from "@/components/index.js";
import { useApiDataStore } from "@/store/index.js";

const ProfitAndLossReport = () => {
  const { fetchData } = useApiDataStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/reports/profit-loss");
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

  const kpiStats = data?.kpiStats || {};
  const monthly = data?.monthlyBreakdown || [];

  const monthlyBreakdown = monthly.map((m) => ({
    month: m.month,
    revenue: parseFloat(m.revenue),
    cogs: parseFloat(m.cogs),
    returns: parseFloat(m.returns),
  }));

  const {
    revenue = 0,
    cogs = 0,
    returns = 0,
    gross_profit: grossProfit = 0,
    net_profit: netProfit = 0,
  } = kpiStats;

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Profit and Loss reports found</div>;

  return (
    <section className="space-y-4">
      <ReportHeader title="Profit and Loss Report" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <KpiStats title="Revenue" value={revenue} format="currency" />
        <KpiStats title="COGS" value={cogs} format="currency" />
        <KpiStats title="Returns" value={returns} format="currency" />
        <KpiStats title="Gross Profit" value={grossProfit} format="currency" />
        <KpiStats title="Net Profit" value={netProfit} format="currency" />
      </div>

      <ChartCard
        title="Profit Breakdown (Monthly)"
        chartType="Bar"
        data={{
          labels: monthlyBreakdown.map((m) => m.month),
          datasets: [
            {
              label: "Revenue",
              data: monthlyBreakdown.map((m) => m.revenue),
              backgroundColor: "#3B82F6",
            },
            {
              label: "COGS",
              data: monthlyBreakdown.map((m) => m.cogs),
              backgroundColor: "#F97316",
            },
            {
              label: "Returns",
              data: monthlyBreakdown.map((m) => m.returns),
              backgroundColor: "#EF4444",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } },
        }}
      />

      <ReportDataTable
        title="Summary"
        headers={["Metric", "Amount ($)"]}
        data={[
          { metric: "Total Revenue", amount: revenue },
          { metric: "Cost of Goods Sold", amount: cogs },
          { metric: "Returns", amount: returns },
          { metric: "Gross Profit", amount: grossProfit },
          { metric: "Net Profit", amount: netProfit },
        ]}
        renderRow={(item, i) => (
          <tr key={i}>
            <td>{item.metric}</td>
            <td>${item.amount.toLocaleString()}</td>
          </tr>
        )}
      />
    </section>
  );
};

export default ProfitAndLossReport;
