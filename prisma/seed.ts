import {
  PrismaClient,
  Avatar,
  QuestKategori,
  AnswerOption,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clean up existing data (optional, be careful in production)
  // await prisma.userAnswer.deleteMany()
  // await prisma.questQuestion.deleteMany()
  // await prisma.questChapter.deleteMany()
  // await prisma.quest.deleteMany()
  // await prisma.shopItem.deleteMany()
  // await prisma.user.deleteMany()
  // await prisma.admin.deleteMany()
  // await prisma.achievement.deleteMany()

  // 1. Achievements
  const achievements = [
    { id: 1, nama: "First Login", syarat: "Pertama kali login" },
    { id: 2, nama: "Completed Profile", syarat: "Bio diisi & avatar diganti" },
    { id: 3, nama: "Level 5 Reached", syarat: "level >= 5" },
    { id: 4, nama: "Bio Master", syarat: "Bio diisi lebih dari 50 karakter" },
    {
      id: 5,
      nama: "Joined Guild",
      syarat: "Masuk ke halaman guild.php pertama kali",
    },
    {
      id: 6,
      nama: "Fundamind Explorer",
      syarat: "Buka semua halaman: guild, shop, profile",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: {},
      create: {
        id: ach.id,
        nama: ach.nama,
        syarat: ach.syarat,
      },
    });
  }

  // 2. Admin
  await prisma.admin.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: "admin",
      password: await bcrypt.hash("admin123", 10), // Changed to a known password
    },
  });

  // 3. Users (Selected important ones)
  const users = [
    {
      id: 1,
      username: "alfan",
      password: "password",
      level: 5,
      xp: 104,
      coin: 327,
      avatar: Avatar.Ellipse_4,
    },
    {
      id: 2,
      username: "gayuh",
      password: "password",
      level: 4,
      xp: 260,
      coin: 399,
      avatar: Avatar.Ellipse_2,
    },
    {
      id: 4,
      username: "afandi",
      password: "password",
      level: 3,
      xp: 21,
      coin: 206,
      avatar: Avatar.Ellipse_1,
    },
    {
      id: 5,
      username: "pratama",
      password: "password",
      level: 3,
      xp: 50,
      coin: 350,
      avatar: Avatar.Ellipse_1,
    },
    {
      id: 6,
      username: "putra",
      password: "password",
      level: 4,
      xp: 85,
      coin: 278,
      avatar: Avatar.Ellipse_1,
    },
    {
      id: 22,
      username: "fandi",
      password: "password",
      level: 3,
      xp: 188,
      coin: 55,
      avatar: Avatar.Ellipse_3,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.username,
        password: hashedPassword,
        level: user.level,
        xp: user.xp,
        coin: user.coin,
        avatar: user.avatar,
      },
    });
  }

  // 4. Shop Items
  const shopItems = [
    {
      id: 1,
      namaItem: "Knowledge Scroll",
      tipeItem: "booster",
      deskripsi: "Tambah 15 XP",
      hargaCoin: 15,
      levelMinimal: 1,
      fileIcon: "icon_686f2b5f26ed06.07590643.png",
    },
    {
      id: 2,
      namaItem: "Insight Orb",
      tipeItem: "hint",
      deskripsi: "Tampilkan petunjuk di soal",
      hargaCoin: 10,
      levelMinimal: 1,
      fileIcon: "magnify.png",
    },
    {
      id: 3,
      namaItem: "Portal Pass",
      tipeItem: "skip",
      deskripsi: "Lewati satu soal",
      hargaCoin: 15,
      levelMinimal: 3,
      fileIcon: "skip.png",
    },
    {
      id: 4,
      namaItem: "Chrono Clock",
      tipeItem: "booster",
      deskripsi: "Tambahan waktu 30 detik (Challenge)",
      hargaCoin: 10,
      levelMinimal: 2,
      fileIcon: "time.png",
    },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // 5. Quests
  const quests = [
    {
      id: 1,
      judul: "Awal Petualangan",
      deskripsi: "Mulai petualanganmu di dunia Fundamind!",
      kategori: QuestKategori.story,
      xpReward: 100,
      coinReward: 50,
      gambarIcon: "Ruin_of_Math 1.png",
    },
    {
      id: 2,
      judul: "Chalenge Harian",
      deskripsi: "Tantang dirimu hari ini",
      kategori: QuestKategori.challenge,
      xpReward: 20,
      coinReward: 10,
      gambarIcon: "The_Shattered_Aksara 1.png",
    },
    {
      id: 3,
      judul: "Boss",
      deskripsi: "Kalahkan boss!",
      kategori: QuestKategori.boss_battle,
      xpReward: 200,
      coinReward: 100,
      gambarIcon: "quest_icon_686f300e57aa07.63713319.png",
    },
  ];

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { id: quest.id },
      update: {},
      create: quest,
    });
  }

  // 6. Boss Quests
  const bossQuests = [
    {
      id: 1,
      questId: 1,
      namaBoss: "Penjaga Gerbang",
      chapterStart: 1,
      chapterEnd: 3,
      deskripsiBoss:
        "Sang penjaga Aksara yang mengamuk karena matematika dilupakan.",
      xpReward: 50,
      coinReward: 25,
    },
    {
      id: 2,
      questId: 1,
      namaBoss: "Raja Pecahan",
      chapterStart: 4,
      chapterEnd: 6,
      deskripsiBoss:
        "Naga yang menjaga pintu menuju dunia digital. Hanya dapat ditaklukkan dengan logika biner.",
      xpReward: 70,
      coinReward: 35,
    },
    {
      id: 3,
      questId: 1,
      namaBoss: "Dewa Persamaan",
      chapterStart: 7,
      chapterEnd: 9,
      deskripsiBoss:
        "Penguasa pecahan yang menguji seberapa dalam pemahamanmu terhadap rasionalitas angka.",
      xpReward: 100,
      coinReward: 50,
    },
    {
      id: 4,
      questId: 1,
      namaBoss: "Makhluk Akar Misteri",
      chapterStart: 10,
      chapterEnd: 12,
      deskripsiBoss:
        "Makhluk misterius dari akar-akar hitam yang hanya muncul saat kekuatan matematika terganggu.",
      xpReward: 120,
      coinReward: 60,
    },
  ];

  for (const boss of bossQuests) {
    await prisma.bossQuest.upsert({
      where: { id: boss.id },
      update: {},
      create: boss,
    });
  }

  // 7. Boss Questions (Sample)
  const bossQuestions = [
    {
      id: 1,
      bossId: 1,
      pertanyaan:
        "Seseorang memiliki 2 keranjang berisi 14 dan 9 apel. Jika ia memindahkan 7 apel dari keranjang pertama ke kedua, berapa selisih isi kedua keranjang sekarang?",
      pilihanA: "0",
      pilihanB: "2",
      pilihanC: "4",
      pilihanD: "6",
      jawabanBenar: "a",
      petunjuk: "Hitung isi akhir masing-masing keranjang, lalu cari selisih.",
    },
    {
      id: 2,
      bossId: 1,
      pertanyaan:
        "Ani membeli 3 buku seharga Rp12.500, Rp9.750, dan Rp13.250. Berapa total yang harus dibayar Ani?",
      pilihanA: "Rp34.500",
      pilihanB: "Rp35.000",
      pilihanC: "Rp33.500",
      pilihanD: "Rp36.250",
      jawabanBenar: "a",
      petunjuk: "Jumlahkan semua harga dengan benar.",
    },
    {
      id: 3,
      bossId: 1,
      pertanyaan:
        "Jika kamu memiliki Rp50.000 dan membeli barang seharga Rp17.500 dan Rp22.000, berapa sisa uangmu?",
      pilihanA: "Rp11.500",
      pilihanB: "Rp10.500",
      pilihanC: "Rp12.000",
      pilihanD: "Rp9.500",
      jawabanBenar: "b",
      petunjuk: "Hitung total pembelian, lalu kurangi dari Rp50.000.",
    },
    {
      id: 11,
      bossId: 3,
      pertanyaan: "Jika 3x + 5 = 20, maka nilai x adalah...",
      pilihanA: "4",
      pilihanB: "5",
      pilihanC: "6",
      pilihanD: "7",
      jawabanBenar: "b",
      petunjuk: "Kurangi 20 dengan 5, lalu bagi 3.",
    },
    {
      id: 16,
      bossId: 4,
      pertanyaan: "Jika √x = 9, maka nilai x adalah...",
      pilihanA: "81",
      pilihanB: "72",
      pilihanC: "64",
      pilihanD: "49",
      jawabanBenar: "a",
      petunjuk: "Kuasai akar kuadrat: balikkan akar.",
    },
  ];

  for (const q of bossQuestions) {
    await prisma.bossQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });
  }

  // 8. Quest Chapters (Quest 1)
  const chapters = [
    {
      id: 1,
      questId: 1,
      nomorChapter: 1,
      judulChapter: "Desa Angka yang Hilang",
      deskripsi:
        "Petualangan dimulai! Bantu penduduk desa menyusun kembali angka-angka dasar yang kacau.",
      coinReward: 5,
      xpReward: 50,
    },
    {
      id: 2,
      questId: 1,
      nomorChapter: 2,
      judulChapter: "Hutan Perkalian Gelap",
      deskripsi:
        "Masuki hutan lebat dan hadapi tantangan dari monster perkalian dan pembagian dasar.",
      coinReward: 6,
      xpReward: 60,
    },
    {
      id: 3,
      questId: 1,
      nomorChapter: 3,
      judulChapter: "Gua Operasi Campuran",
      deskripsi:
        "Gua penuh jebakan aritmatika. Butuh strategi untuk memadukan tambah, kurang, kali, dan bagi!",
      coinReward: 7,
      xpReward: 70,
    },
    {
      id: 4,
      questId: 1,
      nomorChapter: 4,
      judulChapter: "Menara Pola & Urutan",
      deskripsi:
        "Panjat menara teka-teki dan pecahkan pola bilangan untuk naik ke tingkat selanjutnya.",
      coinReward: 8,
      xpReward: 80,
    },
    {
      id: 5,
      questId: 1,
      nomorChapter: 5,
      judulChapter: "Lembah Angka Negatif",
      deskripsi:
        "Suasana mulai gelap. Temukan cara menghadapi bilangan negatif di lembah berkabut ini.",
      coinReward: 9,
      xpReward: 90,
    },
    {
      id: 6,
      questId: 1,
      nomorChapter: 6,
      judulChapter: "Kastil Faktor & Kelipatan",
      deskripsi:
        "Dapatkan kunci rahasia dengan menguak faktor dan kelipatan di dalam kastil misterius.",
      coinReward: 10,
      xpReward: 100,
    },
    {
      id: 7,
      questId: 1,
      nomorChapter: 7,
      judulChapter: "Danau Pecahan & Desimal",
      deskripsi:
        "Arungi danau ajaib dan ubah bentuk pecahan menjadi desimal untuk melanjutkan perjalanan.",
      coinReward: 12,
      xpReward: 110,
    },
    {
      id: 8,
      questId: 1,
      nomorChapter: 8,
      judulChapter: "Labirin Persamaan X",
      deskripsi:
        "Tersesat di labirin! Gunakan persamaan sederhana untuk mencari jalan keluar.",
      coinReward: 14,
      xpReward: 120,
    },
    {
      id: 9,
      questId: 1,
      nomorChapter: 9,
      judulChapter: "Tebing Pecahan Berlapis",
      deskripsi:
        "Tebing curam penuh teka-teki pecahan dan desimal. Uji ketangkasan berhitungmu!",
      coinReward: 16,
      xpReward: 130,
    },
    {
      id: 10,
      questId: 1,
      nomorChapter: 10,
      judulChapter: "Gerbang Logika Terakhir",
      deskripsi:
        "Hadapi penjaga akhir di gerbang logika dengan soal cerita yang menguji akal dan strategi.",
      coinReward: 20,
      xpReward: 150,
    },
  ];

  for (const chapter of chapters) {
    await prisma.questChapter.upsert({
      where: { id: chapter.id },
      update: {},
      create: chapter,
    });
  }

  // 9. Questions (Sample from each chapter)
  const questions = [
    // Chapter 1
    {
      id: 1,
      chapterId: 1,
      pertanyaan: "Berapa hasil dari 5 + 3?",
      pilihanA: "6",
      pilihanB: "7",
      pilihanC: "8",
      pilihanD: "9",
      jawabanBenar: AnswerOption.c,
      petunjuk: "Tambahkan 5 lalu hitung 3 langkah maju.",
      minLevel: 1,
    },
    {
      id: 2,
      chapterId: 1,
      pertanyaan: "Jika kamu punya 10 permen dan dimakan 4, sisa berapa?",
      pilihanA: "5",
      pilihanB: "6",
      pilihanC: "4",
      pilihanD: "7",
      jawabanBenar: AnswerOption.b,
      petunjuk: "Kurangkan 10 dikurangi 4.",
      minLevel: 1,
    },
    {
      id: 3,
      chapterId: 1,
      pertanyaan: "Nilai dari 7 - 2 adalah...",
      pilihanA: "4",
      pilihanB: "5",
      pilihanC: "6",
      pilihanD: "3",
      jawabanBenar: AnswerOption.b,
      petunjuk: "Bayangkan garis bilangan, mundur 2 dari 7.",
      minLevel: 1,
    },
    {
      id: 4,
      chapterId: 1,
      pertanyaan: "3 + 6 = ?",
      pilihanA: "9",
      pilihanB: "8",
      pilihanC: "10",
      pilihanD: "7",
      jawabanBenar: AnswerOption.a,
      petunjuk: "Jumlahkan 3 dan 6.",
      minLevel: 1,
    },
    {
      id: 5,
      chapterId: 1,
      pertanyaan: "15 - 5 = ?",
      pilihanA: "11",
      pilihanB: "12",
      pilihanC: "10",
      pilihanD: "9",
      jawabanBenar: AnswerOption.c,
      petunjuk: "Kurangkan 5 dari 15.",
      minLevel: 1,
    },

    // Chapter 2
    {
      id: 11,
      chapterId: 2,
      pertanyaan: "Berapakah 4 × 2?",
      pilihanA: "6",
      pilihanB: "7",
      pilihanC: "8",
      pilihanD: "10",
      jawabanBenar: AnswerOption.c,
      petunjuk: "Kalikan 4 dua kali.",
      minLevel: 1,
    },
    {
      id: 12,
      chapterId: 2,
      pertanyaan: "12 dibagi 3 sama dengan...",
      pilihanA: "2",
      pilihanB: "3",
      pilihanC: "4",
      pilihanD: "5",
      jawabanBenar: AnswerOption.c,
      petunjuk: "Cari angka yang jika dikali 3 hasilnya 12.",
      minLevel: 1,
    },

    // Chapter 3
    {
      id: 21,
      chapterId: 3,
      pertanyaan: "Berapa hasil dari 3 + 2 × 4?",
      pilihanA: "20",
      pilihanB: "11",
      pilihanC: "10",
      pilihanD: "8",
      jawabanBenar: AnswerOption.b,
      petunjuk: "Kerjakan perkalian dulu.",
      minLevel: 2,
    },

    // Chapter 4
    {
      id: 31,
      chapterId: 4,
      pertanyaan: "Urutan bilangan 2, 4, 6, ... berikutnya adalah?",
      pilihanA: "7",
      pilihanB: "8",
      pilihanC: "9",
      pilihanD: "10",
      jawabanBenar: AnswerOption.b,
      petunjuk: "Itu adalah bilangan genap.",
      minLevel: 2,
    },

    // Chapter 5
    {
      id: 41,
      chapterId: 5,
      pertanyaan: "Berapa hasil dari -3 + 5?",
      pilihanA: "2",
      pilihanB: "3",
      pilihanC: "1",
      pilihanD: "-2",
      jawabanBenar: AnswerOption.a,
      petunjuk: "Pikirkan di garis bilangan.",
      minLevel: 3,
    },

    // Chapter 6
    {
      id: 51,
      chapterId: 6,
      pertanyaan: "Faktor dari 12 adalah?",
      pilihanA: "1,2,3,4,6,12",
      pilihanB: "2,3,5,6,10",
      pilihanC: "1,2,3,5",
      pilihanD: "2,4,8,12",
      jawabanBenar: AnswerOption.a,
      petunjuk: "Bilangan yang membagi habis.",
      minLevel: 3,
    },

    // Chapter 7
    {
      id: 61,
      chapterId: 7,
      pertanyaan: "1/2 sama dengan desimal...",
      pilihanA: "0.1",
      pilihanB: "0.2",
      pilihanC: "0.3",
      pilihanD: "0.5",
      jawabanBenar: AnswerOption.d,
      petunjuk: "1 dibagi 2.",
      minLevel: 4,
    },

    // Chapter 8
    {
      id: 71,
      chapterId: 8,
      pertanyaan: "x + 3 = 7. Maka x = ?",
      pilihanA: "4",
      pilihanB: "5",
      pilihanC: "3",
      pilihanD: "6",
      jawabanBenar: AnswerOption.a,
      petunjuk: "Kurangkan 3 dari 7.",
      minLevel: 5,
    },

    // Chapter 9
    {
      id: 81,
      chapterId: 9,
      pertanyaan: "1/2 + 1/4 = ?",
      pilihanA: "2/4",
      pilihanB: "3/4",
      pilihanC: "1",
      pilihanD: "1/3",
      jawabanBenar: AnswerOption.b,
      petunjuk: "Samakan penyebut: 2/4 + 1/4.",
      minLevel: 6,
    },

    // Chapter 10
    {
      id: 91,
      chapterId: 10,
      pertanyaan:
        "Ali membeli 3 buku seharga 15 ribu, total belanja Ali adalah?",
      pilihanA: "30 ribu",
      pilihanB: "45 ribu",
      pilihanC: "15 ribu",
      pilihanD: "60 ribu",
      jawabanBenar: AnswerOption.b,
      petunjuk: "15 × 3.",
      minLevel: 7,
    },
  ];

  for (const q of questions) {
    await prisma.questQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
