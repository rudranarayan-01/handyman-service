import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // This moves the window back to the top-left (0,0) coordinate
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant", // Use "smooth" if you want a sliding effect
        });
    }, [pathname]); // Fires every time the URL path changes

    return null;
};

export default ScrollToTop;