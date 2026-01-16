"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";

interface ShopItem {
  id: number;
  namaItem: string;
  tipeItem: string | null;
  deskripsi: string | null;
  hargaCoin: number;
  fileIcon: string | null;
  levelMinimal: number;
}

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [userCoin, setUserCoin] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const res = await fetch("/api/shop");
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setUserCoin(data.userCoin);
        setUserLevel(data.userLevel);
      }
    } catch (error) {
      console.error("Error fetching shop items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (itemId: number) => {
    setBuying(itemId);
    setMessage(null);

    try {
      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setUserCoin(data.newBalance);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Gagal membeli item" });
    } finally {
      setBuying(null);
    }
  };

  const getItemIcon = (tipe: string | null) => {
    switch (tipe) {
      case "booster":
        return "⚡";
      case "hint":
        return "💡";
      case "skip":
        return "⏭️";
      default:
        return "📦";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Memuat Shop..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🛒 Item Shop
              </h1>
              <p className="text-amber-200/80">Beli item untuk membantumu!</p>
            </div>
            <div className="bg-yellow-500/20 px-6 py-3 rounded-xl">
              <span className="text-2xl font-bold text-yellow-300">
                💰 {userCoin} Coins
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center ${
              message.type === "success"
                ? "bg-green-500/20 border border-green-500/50 text-green-200"
                : "bg-red-500/20 border border-red-500/50 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const canAfford = userCoin >= item.hargaCoin;
            const meetsLevel = userLevel >= item.levelMinimal;
            const canBuy = canAfford && meetsLevel;

            return (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">
                    {getItemIcon(item.tipeItem)}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {item.namaItem}
                  </h3>
                  <p className="text-purple-200/70 text-sm mt-2">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="text-center mb-4">
                  <span className="text-xl font-bold text-yellow-400">
                    💰 {item.hargaCoin}
                  </span>
                </div>

                {!meetsLevel && (
                  <div className="text-center text-red-400 text-sm mb-3">
                    🔒 Butuh Level {item.levelMinimal}
                  </div>
                )}

                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={!canBuy || buying === item.id}
                  className={`w-full py-2 rounded-xl font-bold transition ${
                    canBuy
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {buying === item.id ? "Membeli..." : "Beli"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
