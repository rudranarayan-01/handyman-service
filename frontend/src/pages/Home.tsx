import HomePageExtraComponents from "@/components/AdditionalComponents"
// import SecondVideoFeature from "@/components/HeroSection/Video2"
import SecondVideoFeature from "@/components/HeroSection/Video2"
import CookingBanner from "@/components/CookingBanner"
import FAQSection from "@/components/FAQ"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import HeroSection from "@/components/Hero"
import InterriorBanner from "@/components/InterriorBanner"
import MostBookedServiceGrid from "@/components/MostBookedServiceGrid"
import OfferSection from "@/components/Offers"
// import ReviewsSection from "@/components/Reviews"
import ServiceGrid from "@/components/ServiceGrid"

const Home = () => {
    return (
        <div className="relative min-h-screen">
            <Header />
            <div
            >
                <HeroSection />
                {/* <HeroVideo/> */}
                <CookingBanner />
                <OfferSection />
                <MostBookedServiceGrid />
                <InterriorBanner />
                <ServiceGrid />
                <HomePageExtraComponents />
                <SecondVideoFeature />
                <FAQSection />
                <Footer />
            </div>
        </div>
    )
}

export default Home