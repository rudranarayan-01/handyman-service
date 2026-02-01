import { impactStats } from '@/data/Reviews';

const Reviews = () => {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {impactStats.map((stat, index) => (
          <div 
            key={index} 
            className="group p-6 md:p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Icon Circle */}
            <div className={`w-12 h-12 md:w-16 md:h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
            
            {/* Subtle progress bar highlight */}
            <div className="mt-4 w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${stat.bgColor.replace('bg-', 'bg-').replace('50', '500')} w-0 group-hover:w-full transition-all duration-700`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;