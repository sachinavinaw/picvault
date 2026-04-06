const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/90 px-10 py-8 shadow-2xl">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500 [animation-direction:reverse] [animation-duration:0.6s]" />
        </div>
        <span className="text-sm font-medium text-gray-500 tracking-wide">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
