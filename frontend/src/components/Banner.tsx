import PromoCard from './PromoCard'

const Banner = () => {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <PromoCard
                title="Interior Design"
                subtitle="Transform your space with our expert interior design services, blending functionality and aesthetics to create your dream environment."
                btnText="Know more"
                image="/images/InterriorDesign/interrior-design.jpg"
                bgColor="bg-[#f8f3f0]" // Light cream from reference
                btnBg="bg-[#5c4335]"   // Dark brown button
                textColor="text-black"
            />
        </section>
    )
}

export default Banner