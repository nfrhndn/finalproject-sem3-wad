import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: "admin@cinemaplus.com" },
        update: {},
        create: {
            name: "Admin CinemaPlus",
            email: "admin@cinemaplus.com",
            password: hashed,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin seed berhasil dimasukkan ke tabel User!");
}

main()
    .catch((e) => {
        console.error("❌ Gagal seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
