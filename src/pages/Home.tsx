import Banner from "@/components/Banner"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import HeroSection from "@/components/Hero"
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
                <Banner/>
                <ServiceGrid/>
                <ReviewsSection/>
                <Footer/>
            </main>
        </div>
    )
}

export default Home