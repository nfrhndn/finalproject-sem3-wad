import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Mulai proses seeding...");

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

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Genre seed berhasil dimasukkan ke tabel Genre!");
}

main()
  .then(() => {
    console.log("🎉 Semua data seed berhasil!");
  })
  .catch((e) => {
    console.error("❌ Gagal seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
