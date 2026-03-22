import PromoCard from './PromoCard'

const InterriorBanner = () => {
    return (
        <section className="py-12 px-6 max-w-360 mx-auto">
            <PromoCard
                title="Interior Design"
                subtitle="Transform your space with our expert interior design services, blending functionality and aesthetics to create your dream environment."
                btnText="Know more"
                image="https://res.cloudinary.com/dnz67rxu0/image/upload/f_auto,q_auto/v1774161135/interrior-design_ilrlkb.jpg"
                bgColor="bg-[#f8f3f0]"
                btnBg="bg-[#5c4335]"  
                textColor="text-black"
            />
        </section>
    )
}

export default InterriorBanner