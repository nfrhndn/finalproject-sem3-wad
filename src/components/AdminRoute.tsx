import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type AdminRouteProps = {
    children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
    const { user, token, loading } = useAuth();

    // ⏳ Saat masih loading → jangan redirect dulu
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Memeriksa akses...</p>
            </div>
        );
    }

    const isAdmin = user?.role?.toLowerCase() === "admin";

    if (!user || !token || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
