"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export default function Predictor() {
  const [rank, setRank] = useState("");
  const [result, setResult] = useState([]);

  const router = useRouter();

  const predict = () => {
    const r = Number(rank);
    if (!r) return;

    if (r < 500) {
      setResult(["IIT Bombay", "IIT Delhi", "IIT Madras"]);
    } else if (r < 2000) {
      setResult(["IIT Kanpur", "IIT Roorkee", "IIT Kharagpur"]);
    } else if (r < 10000) {
      setResult(["NIT Trichy", "NIT Warangal", "IIIT Hyderabad"]);
    } else {
      setResult(["VIT", "SRM", "Manipal"]);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-grid text-white flex flex-col items-center justify-center p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* 🎯 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold flex items-center gap-2 mb-6"
      >
        <GraduationCap size={20} /> College Predictor
      </motion.h1>

      {/* 📦 Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md w-full max-w-md"
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter your rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-md text-sm outline-none focus:border-blue-500"
          />

          <button
            onClick={predict}
            className="bg-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-500 transition"
          >
            Predict
          </button>
        </div>
      </motion.div>

      {/* 📊 Results */}
      {result.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md"
        >
          <h2 className="mb-4 text-sm text-gray-400">
            Suggested Colleges
          </h2>

          <div className="space-y-2">
            {result.map((c, i) => (
              <div
                key={i}
                className="bg-white/5 px-3 py-2 rounded-md border border-white/10 hover:border-blue-500/40 transition"
              >
                {c}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}