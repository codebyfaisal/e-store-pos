const useFilteredData = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) return data;

  if (data.length === 0) return [];

  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;

      // Custom handling for price range filters
      if (key === "minPrice") {
        return item.price >= value;
      }
      if (key === "maxPrice") {
        return item.price <= value;
      }

      if (key === "fromDate") {
        return new Date(item.created_at) >= new Date(value);
      }
      if (key === "toDate") {
        return new Date(item.created_at) <= new Date(value);
      }

      const itemValue = item[key];

      if (typeof value === "string") {
        if (typeof itemValue !== "string") return false;

        const lowerValue = value.toLowerCase();
        const lowerItem = itemValue.toLowerCase();

        if (lowerValue === "paid" || lowerValue === "completed") {
          return lowerItem === lowerValue;
        } else {
          return lowerItem.includes(lowerValue);
        }
      }

      if (typeof value === "number") {
        return itemValue === value;
      }

      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }

      return itemValue === value;
    });
  });
};

export default useFilteredData;
