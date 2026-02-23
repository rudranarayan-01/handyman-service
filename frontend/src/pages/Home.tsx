import HomePageExtraComponents from "@/components/AdditionalComponents"
import CookingBanner from "@/components/CookingBanner"
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
            <main>
                <HeroSection />
                <CookingBanner/>
                <OfferSection/>
                <MostBookedServiceGrid/>
                <InterriorBanner/>
                <ServiceGrid/>
                {/* <ReviewsSection/> */}
                <HomePageExtraComponents/>
                <Footer/>
            </main>
        </div>
    )
}

export default Home