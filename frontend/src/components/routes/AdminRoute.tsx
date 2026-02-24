import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const AdminProtect = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div className="h-screen flex items-center justify-center font-bold text-xs uppercase tracking-widest text-slate-400">Verifying Admin Access...</div>;
    }

    const isAdmin = user?.publicMetadata?.role === "admin" || user?.publicMetadata?.role === "manager";

    if (!isSignedIn || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminProtect;