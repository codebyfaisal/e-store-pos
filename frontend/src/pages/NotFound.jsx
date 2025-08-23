import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="flex items-center justify-center h-full w-full bg-base-200">
      <div className="text-center p-8 bg-base-100 rounded-lg shadow space-y-6 relative">
        <h1 className="text-9xl font-extrabold text-primary-content tracking-widest">
          404
        </h1>
        <div className="bg-primary px-2 text-sm rounded -rotate-12 left-1/3 bottom-2/5` absolute text-white">
          Page Not Found
        </div>
        <p className="text-base-content text-lg mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn btn-primary mt-6">
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
