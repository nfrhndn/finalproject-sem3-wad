import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import NotFound from "../pages/NotFound";

type AdminRouteProps = {
    children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Memeriksa akses...</p>
            </div>
        );
    }

    const isAdmin = user?.role?.toLowerCase() === "admin";

    if (!user || !token || !isAdmin) {
        return <NotFound />;
    }

    return <>{children}</>;
}
