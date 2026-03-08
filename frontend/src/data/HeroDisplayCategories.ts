
export const getHeroOptimizedUrl = (publicId: string) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnz67rxu0';

    // f_auto: chooses best format (WebP/AVIF)
    // q_auto: reduces file size without losing quality
    // w_400: resizes to fit the grid perfectly
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${publicId}`;
};


export const categories = [
    {
        name: "Painting Services",
        image: "painting-services", // Matches your .jpg link
        slug: "home-renovations"
    },
    {
        name: "Cleaning & Pest Control",
        image: "cleaning", // Matches your .jpg link
        slug: "cleaning-&-pest-control"
    },
    {
        name: "Plumbing Services",
        image: "plumbing", // Matches your .jpg link
        slug: "appliance-repair"
    },
    {
        name: "Repairing and Maintenance",
        image: "ac-repair", // Matches your .jpg link
        slug: "appliance-repair"
    },
    {
        name: "Women's Saloon",
        image: "makeup", // Matches your .jpg link
        slug: "personal-grooming-"
    },
    {
        name: "Ayurvedic Massage",
        image: "home-massage-service", // This one is already working
        slug: "personal-grooming-"
    },
];