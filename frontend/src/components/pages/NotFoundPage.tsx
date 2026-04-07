import { Link } from "react-router";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-extrabold text-gray-600 ">404</p>
      <div className="mt-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-500">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeftCircleIcon className="size-5" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
