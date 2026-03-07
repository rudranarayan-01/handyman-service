const BookingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 animate-pulse">
        <div className="flex gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-slate-100 rounded-full w-3/4" />
            <div className="h-3 bg-slate-50 rounded-full w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-4 bg-slate-50 rounded-full w-20" />
              <div className="h-4 bg-slate-50 rounded-full w-20" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default BookingSkeleton;