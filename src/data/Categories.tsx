export interface Category {
    name: string;
    image: string; 
    color: string;
}

export const categories: Category[] = [
    { 
        name: "Painting Services", 
        image: "/images/Painting/painting-services.jpg", 
        color: "bg-blue-50" 
    },
    { 
        name: "Cleaning & Pest Control", 
        image: "/images/Cleaning/cleaning.jpg", 
        color: "bg-yellow-50" 
    },
    { 
        name: "Plumbing Services", 
        image: "/images/Plumbing/Plumbing.jpg", 
        color: "bg-purple-50" 
    },
    { 
        name: "Repairing and Maintenance", 
        image: "/images/Repairing/ac-repair.jpg", 
        color: "bg-cyan-50" 
    },
    { 
        name: "Women's Saloon", 
        image: "/images/Parlour/makeup.jpg", 
        color: "bg-green-50" 
    },
    { 
        name: "Ayurvedic Massage", 
        image: "/images/Parlour/home-massage-service.jpg", 
        color: "bg-rose-50" 
    },
];