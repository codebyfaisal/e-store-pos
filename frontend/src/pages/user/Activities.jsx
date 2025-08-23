import React, { useEffect, useState } from "react";
import { useApiDataStore } from "@/store";
import { Loader } from "@/components";

const Activities = () => {
  const { fetchData } = useApiDataStore();
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  const getData = async (page) => {
    setLoading(false);
    const result = await fetchData(
      `/api/users/activities?limit=${ITEMS_PER_PAGE}&page=${page}`
    );

    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;

    setData(result[0].notifications);
    setTotalData(result[0].totalNotifications);
    setPages(Math.ceil(result[0].totalNotifications / ITEMS_PER_PAGE));
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    getData(1);
  }, [fetchData]);

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Activities found</div>;

  return (
    <section>
      <h1 className="text-3xl font-bold text-base-content mb-4">
        Recent Activity
      </h1>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm">
          Showing {data.length} of {totalData} notifications
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.map((activity) => (
          <div
            key={activity.notification_id}
            className="card rounded bg-base-100 shadow-xs transition duration-200 hover:shadow-sm"
          >
            <div className="card-body space-y-2 p-4">
              <h3 className="card-title text-lg text-primary font-semibold">
                {activity.event_type}
              </h3>
              <p className="text-base-content text-sm">{activity.message}</p>
              <div className="text-xs text-base-content/70">
                {activity.created_at?.split("T")[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => getData(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(pages)].map((_, index) => (
          <button
            key={index}
            onClick={() => getData(index + 1)}
            className={`btn btn-sm ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-sm btn-outline"
          onClick={() => getData(currentPage + 1)}
          disabled={currentPage === pages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Activities;
