import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { FrequentBookedService } from '@/data/FrequentBookedService';

const MostBookedServiceGrid = () => {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            {/* Header with See All */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Frequently Booked Services
                </h2>
                <button className="text-white font-bold text-sm hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg transition-all">
                    See all
                </button>
            </div>

            {/* Shadcn Carousel Container */}
            <div className="relative group">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {FrequentBookedService.map((service: any) => (
                            <CarouselItem
                                key={service.id}
                                className="pl-4 basis-[45%] md:basis-[30%] lg:basis-[22%]"
                            >
                                <div className="cursor-pointer group/card">
                                    {/* Image Container */}
                                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                                        <img
                                            loading='lazy'
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Text Details */}
                                    <div className="space-y-1">
                                        <h4 className="text-[15px] font-medium text-gray-800 leading-tight line-clamp-1">
                                            {service.title}
                                        </h4>

                                        {/* Rating Row */}
                                        <div className="flex items-center gap-1 text-[13px] text-gray-600">
                                            <Star className="w-3.5 h-3.5 fill-gray-700 text-gray-700" />
                                            <span className="font-semibold text-gray-800">{service.rating}</span>
                                            <span className="text-gray-500">({service.reviews})</span>
                                        </div>

                                        {/* Price Row */}
                                        <p className="text-[14px] font-bold text-gray-600 mt-1">
                                            ₹{service.price}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons - Exactly like the reference image */}
                    <div className="hidden md:block transition-opacity duration-300">
                        <CarouselPrevious className="absolute -left-6 top-[35%] h-12 w-12 rounded-full border text-white  bg-white shadow-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out disabled:hidden">
                            <ChevronLeft className="h-6 w-6 stroke-[2.5px]" />
                        </CarouselPrevious>
                        <CarouselNext className="absolute -right-6 top-[35%] h-12 w-12 rounded-full border text-white border-gray-200 bg-white shadow-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out disabled:hidden" >
                            <ChevronRight className="h-6 w-6 stroke-[2.5px] text-white" />
                        </CarouselNext>
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default MostBookedServiceGrid;