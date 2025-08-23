import { useEffect, useState } from "react";
import {
  ChartCard,
  KpiStats,
  ReportDataTable,
  ReportHeader,
  Loader,
} from "@/components/index.js";
import { useApiDataStore } from "@/store/index.js";

const InventoryReport = () => {
  const { fetchData } = useApiDataStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/reports/inventory");
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
    totalProducts = {},
    lowStockProducts = [],
    outOfStockProducts = [],
    recentChanges = [],
    returnedProducts = [],
    inventoryMovement = {},
  } = data || {};

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Inventory reports found</div>;

  return (
    <section className="space-y-4">
      <ReportHeader title="Inventory Report" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <KpiStats
          title="Total Products"
          value={totalProducts?.total_products || 0}
        />
        <KpiStats
          title="Low Stock"
          value={lowStockProducts.length > 0 ? lowStockProducts.length : 0}
        />
        <KpiStats
          title="Out of Stock"
          value={outOfStockProducts.length > 0 ? outOfStockProducts.length : 0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ReportDataTable
          title="Low Stock Products"
          headers={["Product", "Stock"]}
          data={lowStockProducts}
          renderRow={(p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.stock}</td>
            </tr>
          )}
        />

        <ReportDataTable
          title="Out of Stock"
          headers={["Product"]}
          data={outOfStockProducts}
          renderRow={(p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
            </tr>
          )}
        />
      </div>

      <ReportDataTable
        title="Recent Stock Changes"
        headers={["Product", "New Qty", "Updated At"]}
        data={recentChanges}
        renderRow={(item, i) => (
          <tr key={i}>
            <td>{item.name}</td>
            <td>{item.newqty}</td>
            <td>{new Date(item.updatedat).toLocaleDateString()}</td>
          </tr>
        )}
      />

      <ReportDataTable
        title="Returned Products"
        headers={["Product", "Quantity", "Reason", "Date"]}
        data={returnedProducts}
        renderRow={(item, i) => (
          <tr key={i}>
            <td>{item.name}</td>
            <td>{item.qty}</td>
            <td>{item.reason}</td>
            <td>{item.date}</td>
          </tr>
        )}
      />

      <ChartCard
        title="Inventory Movement Over Time"
        chartType="Line"
        data={{
          labels: inventoryMovement.date ? [inventoryMovement.date] : [],
          datasets: [
            {
              label: "Stock Decreased (Sales)",
              data: inventoryMovement.sales ? [inventoryMovement.sales] : [],
              borderColor: "#EF4444",
              fill: false,
            },
            {
              label: "Stock Increased (Returns)",
              data: inventoryMovement.returns
                ? [inventoryMovement.returns]
                : [],
              borderColor: "#10B981",
              fill: false,
            },
          ],
        }}
      />
    </section>
  );
};

export default InventoryReport;
