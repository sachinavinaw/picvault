import { useNavigate } from "react-router";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const UploadSuccessBanner = ({ handleReset }: { handleReset: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-green-50">
      <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
      <p className="text-lg font-medium text-gray-900 mb-4">All files uploaded successfully!</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload More?
        </button>
        <button
          type="button"
          onClick={() => navigate("/gallery")}
          className="px-6 py-2 bg-white text-blue-600 border border-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          View Gallery
        </button>
      </div>
    </div>
  );
};

export default UploadSuccessBanner;
