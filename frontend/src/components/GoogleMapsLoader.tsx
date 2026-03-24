import { useJsApiLoader } from '@react-google-maps/api';
import React from 'react';

const libraries: ("places" | "drawing" | "geometry")[] = ['places'];

const GoogleMapsLoader = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBC8kMi6HizxNXkhsVXJamSN88BWkVlWvA",
        libraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return null; // Or a simple loading spinner

    return <>{children}</>;
};

export default GoogleMapsLoader;