import React from 'react';
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    if (!isSignedIn) {
        return(
            <div className="flex items-center justify-center py-20">
                <SignIn/>
            </div>
        )
    }

    return <>{children}</>;
};

export default ProtectedRoutes