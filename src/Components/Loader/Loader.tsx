import React from "react";

interface LoaderProps {
  text?: string;
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  text = "Loading...",
  fullPage = false,
}) => {
  return (
    <div
      data-testid="loader"
      className={`flex items-center justify-center ${
        fullPage ? "min-h-screen bg-white-500" : "py-3"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
          aria-label="loading-spinner"
        />

        {/* Optional text */}
        <p className="text-md font-semibold text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
