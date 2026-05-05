"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  MapPin,
  IndianRupee,
  Star,
  BarChart3,
  GraduationCap,
} from "lucide-react";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");

  const compareRef = useRef(null); // 🔥 scroll ref

  const fetchColleges = async () => {
    setLoading(true);

    let url = "https://college-platform-6rgd.onrender.com/colleges?";
    if (search) url += `search=${search}&`;
    if (location) url += `location=${location}&`;
    if (maxFees) url += `maxFees=${maxFees}&`;

    const res = await fetch(url);
    const data = await res.json();

    setColleges(data);
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(fetchColleges, 350);
    return () => clearTimeout(delay);
  }, [search, location, maxFees]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    } else {
      toast.error("Max 3 colleges allowed");
    }
  };

  const compare = async () => {
    if (selected.length < 2) {
      toast.error("Select at least 2 colleges");
      return;
    }

    const res = await fetch(
      `https://college-platform-6rgd.onrender.com/compare?ids=${selected.join(",")}`
    );
    const data = await res.json();
    setCompareData(data);

    toast.success("Comparison ready 👇");

    // 🔥 Auto scroll
    setTimeout(() => {
      compareRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black bg-grid text-white p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
  
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <GraduationCap size={20} /> College Finder
        </h1>

        <Link href="/predictor">
          <button className="bg-white/10 px-4 py-2 rounded hover:bg-white/20 transition text-sm">
            🎯 Predictor
          </button>
        </Link>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 px-3 py-2 rounded-md text-sm"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-white/5 border border-white/10 px-3 py-2 rounded-md text-sm"
        />

        <input
          type="number"
          placeholder="Max Fees"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
          className="bg-white/5 border border-white/10 px-3 py-2 rounded-md text-sm"
        />

        <button
          onClick={() => {
            setSearch("");
            setLocation("");
            setMaxFees("");
          }}
          className="bg-white/10 px-3 py-2 rounded-md text-sm hover:bg-white/20"
        >
          Clear
        </button>
      </div>

      {/* Compare Button */}
      <div className="text-center mb-8">
        <button
          onClick={compare}
          className="bg-white/10 border border-white/10 px-5 py-2 rounded-md text-sm hover:bg-white/20 transition"
        >
          Compare ({selected.length})
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-5 rounded-xl shimmer"
            >
              <div className="h-4 bg-white/10 w-1/2 mb-3 rounded"></div>
              <div className="h-3 bg-white/10 w-1/3 mb-2 rounded"></div>
              <div className="h-3 bg-white/10 w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Cards */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college, index) => (
            <Link key={college.id} href={`/college/${college.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer bg-white/[0.03] border border-white/10 p-5 rounded-xl backdrop-blur-md hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition"
              >
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap size={16} /> {college.name}
                </h2>

                <div className="mt-3 text-sm text-gray-300 space-y-1">
                  <p className="flex gap-2 items-center">
                    <MapPin size={14} /> {college.location}
                  </p>

                  <p className="flex gap-2 items-center">
                    <IndianRupee size={14} /> {college.fees}
                  </p>

                  <p className="flex gap-2 items-center text-yellow-400">
                    <Star size={14} /> {college.rating}
                  </p>

                  <p className="flex gap-2 items-center text-green-400">
                    <BarChart3 size={14} /> {college.placement}%
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSelect(college.id);
                  }}
                  className={`mt-4 text-sm px-3 py-1 rounded-md transition ${
                    selected.includes(college.id)
                      ? "bg-red-500/80 hover:bg-red-500"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {selected.includes(college.id)
                    ? "Remove"
                    : "Add to Compare"}
                </button>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Comparison */}
      {compareData.length > 0 && (
        <div
          ref={compareRef}
          className="mt-12 bg-white/5 border border-white/10 p-6 rounded-xl"
        >
          <h2 className="text-lg font-semibold text-center mb-4">
            ⚖️ Comparison
          </h2>

          <table className="w-full text-sm text-center">
            <thead className="bg-white/10">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Fees</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Placement</th>
              </tr>
            </thead>

            <tbody>
              {compareData.map((c) => (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">₹{c.fees}</td>
                  <td className="p-2">{c.rating}</td>
                  <td className="p-2">{c.placement}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}