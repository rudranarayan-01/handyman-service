export type OrderStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';

export interface Order {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    status: OrderStatus;
    price: number;
    technician?: string;
    image: string;
}

export const orderHistory: Order[] = [
    {
        id: "ORD-9921",
        serviceName: "AC Deep Cleaning",
        date: "12 Feb 2026",
        time: "10:00 AM",
        status: "Scheduled",
        price: 1499,
        technician: "Ramesh Kumar",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200"
    },
    {
        id: "ORD-8842",
        serviceName: "Kitchen Chimney Repair",
        date: "05 Feb 2026",
        time: "02:30 PM",
        status: "Completed",
        price: 899,
        technician: "Suresh Pal",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200"
    },
    {
        id: "ORD-7710",
        serviceName: "Home Painting (Living Room)",
        date: "28 Jan 2026",
        time: "09:00 AM",
        status: "Cancelled",
        price: 4500,
        image: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?q=80&w=200"
    }
];