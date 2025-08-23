// utils/getEntityStats.js

function getEntityStats({
  data = [],
  groupBy = "brand",
  extractSubField = "category", 
}) {
  const grouped = {};

  data.forEach((item) => {
    const key = item[groupBy];
    if (!key) return;

    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        items: [],
      };
    }
    grouped[key].items.push(item);
  });

  return Object.values(grouped).map(({ name, items }) => {
    const totalItems = items.length;
    const avgPrice = totalItems
      ? items.reduce((sum, p) => sum + p.price, 0) / totalItems
      : 0;
    const totalStock = items.reduce((sum, p) => sum + p.stock, 0);
    const related = extractSubField
      ? [...new Set(items.map((p) => p[extractSubField]))].join(", ")
      : "";

    return {
      [groupBy]: name,
      totalItems,
      avgPrice,
      totalStock,
      [extractSubField + "s"]: related,
    };
  });
}

export default getEntityStats;
