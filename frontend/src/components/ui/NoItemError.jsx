import React from "react";

const NoItemError = ({ error }) => {
  return (
    <div className="grid gap-2 sm:h-40 md:h-60 place-content-center text-center">
      <span className="text-4xl text-accent-content">Oops!</span>
      <span className="text-2xl text-neutral">{error}</span>
    </div>
  );
};

export default NoItemError;
