export default function AdminNavbar() {
    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 ml-64">
            <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
            <div className="flex items-center gap-3">
                <img
                    src="/avatar-admin.png"
                    alt="Admin Avatar"
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 text-sm">Super Admin</span>
            </div>
        </header>
    );
}
