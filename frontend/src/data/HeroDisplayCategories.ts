
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
        slug: "home-renovation"
    },
    {
        name: "Cleaning & Pest Control",
        image: "cleaning", // Matches your .jpg link
        slug: "hygiene-and-deep-cleaning"
    },
    {
        name: "Plumbing Services",
        image: "plumbing", // Matches your .jpg link
        slug: "master-plumbing-services"
    },
    {
        name: "Repairing and Maintenance",
        image: "ac-repair", // Matches your .jpg link
        slug: "ac-and-cooling-solutions"
    },
    {
        name: "Women's Saloon",
        image: "makeup", // Matches your .jpg link
        slug: "personal-grooming"
    },
    {
        name: "Ayurvedic Massage",
        image: "home-massage-service", // This one is already working
        slug: "personal-grooming"
    },
];