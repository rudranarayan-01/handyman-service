export interface ServiceCardProps {
    id: string;
    title: string;
    rating: number;
    reviews: string; // e.g., "95K"
    price: number;
    image: string;
}

export const FrequentBookedService: ServiceCardProps[] = [
    {
        id: "1",
        title: "Health Checkup",
        rating: 4.76,
        reviews: "15K",
        price: 499,
        image: "/images/MedicalServices/medical-checkup.jpg"
    },
    {
        id: "2",
        title: "Car Washing",
        rating: 4.77,
        reviews: "159K",
        price: 499,
        image: "/images/Cleaning/car-cleaning.jpg"
    },
    {
        id: "3",
        title: "Kitchen Dishes Cleaning",
        rating: 4.79,
        reviews: "53K",
        price: 399,
        image: "/images/Cleaning/kitchen-cleaning.jpg"
    },
    {
        id: "4",
        title: "AC uninstallation",
        rating: 4.82,
        reviews: "124K",
        price: 699,
        image: "/images/Repairing/ac-services.jpeg"
    },
     {
        id: "1",
        title: "Gas stove check-up",
        rating: 4.76,
        reviews: "95K",
        price: 99,
        image: "/images/Kitchen/gas-stove.jpg"
    },
    {
        id: "2",
        title: "TV check-up",
        rating: 4.77,
        reviews: "159K",
        price: 249,
        image: "/images/Repairing/tv1.jpg"
    },
    {
        id: "3",
        title: "Deep chimney service",
        rating: 4.79,
        reviews: "53K",
        price: 1199,
        image: "/images/Cleaning/deep-chimney.png"
    },
    {
        id: "4",
        title: "AC uninstallation",
        rating: 4.82,
        reviews: "124K",
        price: 699,
        image: "/images/Repairing/ac-services.jpeg"
    }
]; 