import { useSearchParams, useNavigate } from "react-router";
import { HTTP_STATUS } from "../../constants/http";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code") || "Error";
  const message =
    searchParams.get("message") || "An unexpected error occurred.";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-300">{code}</h1>
        <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute">
          {code !== "Error" ? "Error" : "Unknown Error"}
        </div>
        <p className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
          {message}
        </p>

        {code === `${HTTP_STATUS.SERVICE_UNAVAILABLE}` ? (
          <p className="text-gray-700 font-medium text-lg">
            Please try after some time
          </p>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
