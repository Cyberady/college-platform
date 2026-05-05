import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  MapPin,
  IndianRupee,
  Star,
  BarChart3,
  GraduationCap,
} from "lucide-react";

export default function CollegeDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [college, setCollege] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/colleges/${id}`)
      .then((res) => res.json())
      .then((data) => setCollege(data))
      .catch((err) => console.error(err));
  }, [id]);

  // 🔥 SAFE CENTER LOADER (no SSR issues)
  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

          <p className="text-gray-400 text-sm">
            Loading college details...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-grid text-white p-8">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
      >
        ← Back
      </button>

      {/* Centered Content */}
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-xl"
        >
          {/* Title */}
          <h1 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <GraduationCap size={18} /> {college.name}
          </h1>

          {/* Info */}
          <div className="space-y-2 text-gray-300">
            <p className="flex gap-2 items-center">
              <MapPin size={14} /> {college.location}
            </p>

            <p className="flex gap-2 items-center">
              <IndianRupee size={14} /> ₹{college.fees}
            </p>

            <p className="flex gap-2 items-center text-yellow-400">
              <Star size={14} /> {college.rating}
            </p>

            <p className="flex gap-2 items-center text-green-400">
              <BarChart3 size={14} /> {college.placement}%
            </p>
          </div>

          {/* Sections */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Courses</h2>
            <p className="text-gray-400">
              B.Tech, M.Tech, MBA (mock data)
            </p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Reviews</h2>
            <p className="text-gray-400">
              ⭐ Excellent college with strong placements!
            </p>
          </div>

        </motion.div>

      </div>
    </div>
  );
}