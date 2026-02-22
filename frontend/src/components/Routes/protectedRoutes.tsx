import { SignIn, useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn, isLoaded } = useAuth();

    // Show a loader while Clerk checks if the user is logged in
    if (!isLoaded) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    // If not signed in, boot them to the login page
    if (!isSignedIn) {
        // Save the current location to redirect back after login
        // return <Navigate to="/" state={{ from: window.location.pathname }} replace />;
        return(
            <div className="flex items-center justify-center py-20">
                <SignIn/>
            </div>
        )
    }

    return <>{children}</>;
};