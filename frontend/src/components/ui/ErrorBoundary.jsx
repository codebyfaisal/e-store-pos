import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorSource: "",
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    let errorSource = "App"; 

    if (error && error.message && error.message.includes("NetworkError")) {
      errorSource = "Server";
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorSource: errorSource,
    });
  }

  render() {
    if (this.state.hasError) {
      const { errorSource, error, errorInfo } = this.state;

      return (
<div className="container mx-auto my-8 h-full grid place-items-center">
  <div className="flex flex-col justify-center items-center gap-4 h-full">
    
    {/* Card Container */}
    <div className="card w-full max-w-md bg-base-100 shadow-xl p-6 rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-4">
        {errorSource === "Server"
          ? "Server Error: Something went wrong on the server."
          : "Application Error: Something went wrong in the app."}
      </h2>

      {/* Error Message */}
      {errorSource === "Server" ? (
        <div className="text-center mb-4">
          <p className="text-xl text-gray-700 mb-2">
            Please check your network connection or try again later.
          </p>
          <button className="btn btn-primary text-white">Try Again</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <details className="flex flex-col gap-2">
            <summary className="font-semibold text-primary cursor-pointer">Click for details</summary>
            <pre className="text-sm text-error bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {error && error.toString()}
            </pre>
            <pre className="text-sm text-error bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
        </div>
      )}
    </div>

    {/* Optional: Additional Action (e.g., Contact Support) */}
    <div className="mt-4 text-center">
      <a href="/support" className="text-primary underline">Contact Support</a>
    </div>

  </div>
</div>

      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;