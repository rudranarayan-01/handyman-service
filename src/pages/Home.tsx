import Banner from "@/components/Banner"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import HeroSection from "@/components/Hero"
import MostBookedServiceGrid from "@/components/MostBookedServiceGrid"
import OfferSection from "@/components/Offers"
import ReviewsSection from "@/components/Reviews"
import ServiceGrid from "@/components/ServiceGrid"

const Home = () => {
    return (
        <div className="relative min-h-screen">
            <Header />
            <main>
                <HeroSection />
                <OfferSection/>
                <MostBookedServiceGrid/>
                <Banner/>
                <ServiceGrid/>
                <ReviewsSection/>
                <Footer/>
            </main>
        </div>
    )
}

export default Home