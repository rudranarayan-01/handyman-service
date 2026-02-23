import { offers } from '../data/Offers';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OfferSection = () => {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Offers & Discounts</h2>

            <Carousel opts={{ align: "start" }} className="w-full relative group">
                <CarouselContent className="-ml-4">
                    {offers.map((offer, index) => (
                        <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className={`${offer.bgColor} relative h-55 rounded-xl overflow-hidden flex`}>

                                {/* Left Content (Text) */}
                                <div className={`z-10 w-[60%] p-6 flex flex-col justify-between ${offer.textColor}`}>
                                    <div>
                                        <p className="text-[12px] text-red-500 font-bold opacity-80 mb-2 uppercase tracking-tighter">
                                            {offer.desc}
                                        </p>
                                        <h3 className="text-2xl font-black leading-tight">
                                            {offer.title}
                                        </h3>
                                    </div>

                                    <Button className="w-fit px-6 py-2 bg-white text-white hover:bg-gray-100 rounded-lg font-bold text-sm shadow-sm transition-all border-none">
                                        {offer.btnText}
                                    </Button>
                                </div>

                                {/* Right Image (Blended) */}
                                <div className="absolute right-0 top-0 h-full w-[50%]">
                                    <img
                                        loading='lazy'
                                        src={offer.image}
                                        alt={offer.title}
                                        className="h-full w-full object-cover"
                                        style={{
                                            maskImage: 'linear-gradient(to left, black 90%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                                        }}
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Left Button - Only shows when you scroll right */}
                <CarouselPrevious
                    className="absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-12 text-white rounded-full border border-gray-200 bg-white shadow-lg  hover:scale-105 transition-all z-30 flex items-center justify-center disabled:opacity-0"
                >
                    <ChevronLeft className="h-6 w-6 stroke-[2.5px] text-white" />
                </CarouselPrevious>

                {/* Right Button - Always prominent like the reference */}
                <CarouselNext
                    className="absolute -right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-gray-200 bg-white text-gray-100 shadow-lg  hover:scale-105 transition-all z-30 flex items-center justify-center"
                >
                    <ChevronRight className="h-6 w-6 stroke-[2.5px]" />
                </CarouselNext>
            </Carousel>
        </section>
    );
};

export default OfferSection;