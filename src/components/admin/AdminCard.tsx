import type { ReactNode } from "react";

interface Props {
    icon: ReactNode;
    label: string;
    value: string;
    growth: string;
}

export default function AdminCard({ icon, label, value, growth }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{label}</span>
                <div className="text-cyan-600">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-green-500 text-sm">{growth}</p>
        </div>
    );
}
