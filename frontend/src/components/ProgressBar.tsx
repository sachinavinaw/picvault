const ProgressBar = ({ uploadProgress }: { uploadProgress: number }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Uploading...</span>
        <span>{uploadProgress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
