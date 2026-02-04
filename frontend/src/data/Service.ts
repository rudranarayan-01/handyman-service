// export interface ServiceCardProps {
//     id: string;
//     title: string;
//     rating: number;
//     reviews: string; // e.g., "95K"
//     price: number;
//     image: string;
// }

// export const applianceServices: ServiceCardProps[] = [
//     {
//         id: "1",
//         title: "Gas stove check-up",
//         rating: 4.76,
//         reviews: "95K",
//         price: 99,
//         image: "/images/Kitchen/gas-stove.jpg"
//     },
//     {
//         id: "2",
//         title: "TV check-up",
//         rating: 4.77,
//         reviews: "159K",
//         price: 249,
//         image: "/images/Repairing/tv1.jpg"
//     },
//     {
//         id: "3",
//         title: "Deep chimney service",
//         rating: 4.79,
//         reviews: "53K",
//         price: 1199,
//         image: "/images/Kitchen/deep-chimney.png"
//     },
//     {
//         id: "4",
//         title: "AC uninstallation",
//         rating: 4.82,
//         reviews: "124K",
//         price: 699,
//         image: "/images/Repairing/ac-services.jpeg"
//     },
//     {
//         id: "1",
//         title: "Gas stove check-up",
//         rating: 4.76,
//         reviews: "95K",
//         price: 99,
//         image: "/images/Kitchen/gas-stove.jpg"
//     },
//     {
//         id: "2",
//         title: "TV check-up",
//         rating: 4.77,
//         reviews: "159K",
//         price: 249,
//         image: "/images/Repairing/tv1.jpg"
//     },
//     {
//         id: "3",
//         title: "Deep chimney service",
//         rating: 4.79,
//         reviews: "53K",
//         price: 1199,
//         image: "/images/Cleaning/deep-chimney.png"
//     },
//     {
//         id: "4",
//         title: "AC uninstallation",
//         rating: 4.82,
//         reviews: "124K",
//         price: 699,
//         image: "/images/Repairing/ac-services.jpeg"
//     }
// ]; 

export interface ServiceCardProps {
    id: string;
    category: string; // Add this for routing (e.g., 'appliance-repair')
    title: string;
    rating: number;
    reviews: string; 
    price: number;
    image: string;
    description?: string; // Optional: card ko modern banane ke liye
}

export const applianceServices: ServiceCardProps[] = [
    {
        id: "1",
        category: "appliance-repair",
        title: "Gas stove check-up",
        rating: 4.76,
        reviews: "95K",
        price: 99,
        image: "/images/Kitchen/gas-stove.jpg",
        description: "Standard safety check and cleaning of burners."
    },
    {
        id: "2",
        category: "appliance-repair",
        title: "TV check-up",
        rating: 4.77,
        reviews: "159K",
        price: 249,
        image: "/images/Repairing/tv1.jpg",
        description: "Diagnostic check for display and sound issues."
    },
    
    {
        id: "1",
        category: "appliance-repair",
        title: "Gas stove check-up",
        rating: 4.76,
        reviews: "95K",
        price: 99,
        image: "/images/Kitchen/gas-stove.jpg",
        description: "Standard safety check and cleaning of burners."
    },
    {
        id: "2",
        category: "appliance-repair",
        title: "TV check-up",
        rating: 4.77,
        reviews: "159K",
        price: 249,
        image: "/images/Repairing/tv1.jpg",
        description: "Diagnostic check for display and sound issues."
    },
    
    {
        id: "1",
        category: "appliance-repair",
        title: "Gas stove check-up",
        rating: 4.76,
        reviews: "95K",
        price: 99,
        image: "/images/Kitchen/gas-stove.jpg",
        description: "Standard safety check and cleaning of burners."
    },
    {
        id: "2",
        category: "appliance-repair",
        title: "TV check-up",
        rating: 4.77,
        reviews: "159K",
        price: 249,
        image: "/images/Repairing/tv1.jpg",
        description: "Diagnostic check for display and sound issues."
    },
    
];