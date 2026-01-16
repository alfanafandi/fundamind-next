import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-8xl">🎮</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            FUNDAMIND
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Belajar Matematika Melalui Petualangan Seru!
            <br />
            Selesaikan Quest, Kalahkan Boss, dan Jadilah Master!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-lg rounded-xl hover:from-amber-300 hover:to-orange-400 transition shadow-lg hover:shadow-xl"
            >
              🚀 Mulai Petualangan
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 transition"
            >
              🔑 Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Fitur Seru Menanti!
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📖"
              title="Story Quest"
              description="Petualangan step-by-step dengan cerita yang menarik. Pelajari matematika sambil menyelesaikan misi!"
            />
            <FeatureCard
              icon="⏱️"
              title="Challenge Quest"
              description="Uji kecepatanmu! Jawab 10 soal dalam 3 menit dan dapatkan skor tertinggi."
            />
            <FeatureCard
              icon="👹"
              title="Boss Battle"
              description="Kalahkan Boss dengan menjawab semua soal dengan benar. Dapatkan reward besar!"
            />
            <FeatureCard
              icon="🛒"
              title="Item Shop"
              description="Beli item power-up dengan koin yang kamu kumpulkan. Hint, Skip, dan Time Boost!"
            />
            <FeatureCard
              icon="📊"
              title="Level & XP"
              description="Naik level dengan mengumpulkan XP. Unlock fitur dan item baru seiring levelmu naik!"
            />
            <FeatureCard
              icon="🏆"
              title="Leaderboard"
              description="Bersaing dengan pemain lain! Jadilah yang terbaik di papan peringkat."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-purple-300/60">
        <p>© 2025 Fundamind. Built with Next.js & Prisma.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-purple-200/80">{description}</p>
    </div>
  );
}
