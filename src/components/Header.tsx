import { useEffect, useState } from "react";

export default function Header() {
    const [tanggal, setTanggal] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTanggal(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <h1 className="logo-text">PARKFUTURE</h1>
            <div className="time-display">
                {tanggal.toLocaleTimeString("id-ID")} |{" "}
                {tanggal.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
        </header>
    );
}
