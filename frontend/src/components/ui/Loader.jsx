import React from "react";

const Loader = ({ message = "" }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      {message && <div className="font-semibold text-primary text-center mt-4">{message}</div>}
    </div>
  );
};

export default Loader;