import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import api from "@/api/api";
export const useUserSync = () => {
    const { user, isLoaded } = useUser();
    const hasSynced = useRef(false);

    useEffect(() => {
        const sync = async () => {
            if (isLoaded && user && !hasSynced.current) {
                try {
                    // console.log("Clerk Metadata:", user.publicMetadata); // Debug karne ke liye

                    const response = await api.post("/auth/sync-user", {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        photo: user.imageUrl,
                        role: user.publicMetadata?.role || 'user' 
                    });

                    if (response.data.success) {
                        console.log("✅ User Synced with MongoDB. Role:", response.data.user.role);
                        hasSynced.current = true;
                    }
                } catch (err) {
                    console.error("❌ Sync Error:", err);
                }
            }
        };

        sync();
    }, [isLoaded, user]);
};