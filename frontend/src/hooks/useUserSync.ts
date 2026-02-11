import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import api from "@/api/api";

export const useUserSync = () => {
    const { user, isLoaded } = useUser();
    const hasSynced = useRef(false); // Ye prevent karega ki ek hi session mein baar-baar sync na ho

    useEffect(() => {
        const sync = async () => {
            // Jab Clerk load ho jaye aur user login ho, tabhi sync karo
            if (isLoaded && user && !hasSynced.current) {
                try {
                    const response = await api.post("/auth/sync-user", {
                        clerkId: user.id, // Clerk ID
                        email: user.primaryEmailAddress?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        photo: user.imageUrl
                    });

                    if (response.data.success) {
                        console.log("✅ User Synced with MongoDB");
                        hasSynced.current = true; // Sync complete, ab dobara nahi chalega
                    }
                } catch (err) {
                    console.error("❌ Sync Error:", err);
                }
            }
        };

        sync();
    }, [isLoaded, user]);
};