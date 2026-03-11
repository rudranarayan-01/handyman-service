import PromoCard from './PromoCard'

const InterriorBanner = () => {
    return (
        <section className="py-12 px-6 max-w-360 mx-auto">
            <PromoCard
                title="Interior Design"
                subtitle="Transform your space with our expert interior design services, blending functionality and aesthetics to create your dream environment."
                btnText="Know more"
                image="/images/InterriorDesign/interrior-design.jpg"
                bgColor="bg-[#f8f3f0]"
                btnBg="bg-[#5c4335]"  
                textColor="text-black"
            />
        </section>
    )
}

export default InterriorBanner