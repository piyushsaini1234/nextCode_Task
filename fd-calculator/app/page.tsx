"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PAYOUT_OPTIONS = ["Quarterly", "Half yearly", "Yearly", "At Maturity"] as const;
type Payout = (typeof PAYOUT_OPTIONS)[number];

const CUMULATIVE_RATE: Record<Payout, string> = {
  Quarterly: "7.19%",
  "Half yearly": "7.12%",
  Yearly: "7.00%",
  "At Maturity": "7.00%",
};

export default function FDCalculator() {
  const [p, setP] = useState(100000);
  const [r, setR] = useState(7);
  const [t, setT] = useState(5);
  const [payout, setPayout] = useState<Payout>("Quarterly");

  // Simple Interest Formula: M = P + (P × r × t / 100)
  const interest = (p * r * t) / 100;
  const maturity = p + interest;

  const data = Array.from({ length: t }, (_, i) => ({
    year: i + 1,
    amount: Math.round(p + (p * r * (i + 1)) / 100),
  }));

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const pct = (val: number, min: number, max: number) =>
    ((val - min) / (max - min)) * 100;

  return (
    <main className="h-screen bg-[#f5f0eb] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl h-full max-h-[600px] bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">

        {/* ── LEFT PANEL ── */}
        <div className="flex-1 p-7 flex flex-col gap-4 overflow-auto">
          <div>
            <h1 className="text-2xl font-bold text-[#5c3d1e]">FD Calculator</h1>
            <p className="text-sm text-[#a0856a] mt-1">
              Estimates how much your fixed deposit investment will grow over time.
            </p>
          </div>

          {/* Deposit Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Deposit Amount (₹)</label>
              <span className="text-sm bg-gray-100 rounded-md px-3 py-1 font-semibold text-gray-800">
                {p.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range" min={10000} max={5000000} step={10000} value={p}
              onChange={(e) => setP(+e.target.value)}
              className="w-full accent-[#7a5c3c] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10000</span><span>24,45,000</span><span>50,00,000</span>
            </div>
          </div>

          {/* Rate of Return */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Rate Of Return (%)</label>
              <span className="text-sm bg-gray-100 rounded-md px-3 py-1 font-semibold text-gray-800">
                {r}
              </span>
            </div>
            <input
              type="range" min={5} max={30} step={0.5} value={r}
              onChange={(e) => setR(+e.target.value)}
              className="w-full accent-[#7a5c3c] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span><span>17.5%</span><span>30%</span>
            </div>
          </div>

          {/* Interest Payout */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Interest Payout</label>
              <span className="text-xs text-[#a0856a]">
                Cumulative Rate Of Return is{" "}
                <span className="font-semibold">{CUMULATIVE_RATE[payout]}</span>
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPayout(opt)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    payout === opt
                      ? "bg-[#7a5c3c] text-white border-[#7a5c3c]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#7a5c3c]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Time Period */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Time Period (Years)</label>
              <span className="text-sm bg-gray-100 rounded-md px-3 py-1 font-semibold text-gray-800">
                {t}
              </span>
            </div>
            <input
              type="range" min={1} max={50} step={1} value={t}
              onChange={(e) => setT(+e.target.value)}
              className="w-full accent-[#7a5c3c] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span><span>25</span><span>50</span>
            </div>
          </div>

          {/* Calculate Button */}
          <div>
            <button className="bg-[#7a5c3c] hover:bg-[#5c3d1e] text-white rounded-full px-8 py-2.5 font-semibold text-sm transition-colors">
              Calculate
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-[#d4bfaa] p-7 flex flex-col gap-4 overflow-hidden">

          {/* Maturity & Interest */}
          <div className="flex gap-10">
            <div>
              <p className="text-xs text-[#7a5c3c] font-medium mb-1">Maturity Amount</p>
              <p className="text-2xl font-bold text-[#3a2510]">{fmt(maturity)}</p>
            </div>
            <div>
              <p className="text-xs text-[#7a5c3c] font-medium mb-1">Interest Earned</p>
              <p className="text-2xl font-bold text-[#3a2510]">{fmt(interest)}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-4 flex-1 flex flex-col min-h-0">
            <div className="flex gap-4 mb-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-[#7a5c3c]" />
                Selected Year
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-[#d4bfaa]" />
                Other Years
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="30%">
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} width={45}
                  tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip  formatter={(value) => [fmt(Number(value ?? 0)), "Maturity"]} contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={i === t - 1 ? "#7a5c3c" : "#d4bfaa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CTA Cards */}
          <div className="flex gap-4 shrink-0">
            {/* Card 1 */}
            <div className="flex-1 bg-[#5c3d1e] rounded-xl p-4 flex flex-col justify-between h-[110px]">
              {/* Top row: badge + arrow */}
              <div className="flex items-start justify-between">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Personalised
                </span>
                <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs shrink-0">↗</button>
              </div>
              {/* Bottom: title + subtitle */}
              <div>
                <p className="text-white font-bold text-sm leading-snug">Check Suitable Products For Your Investment</p>
                <p className="text-[#c9a98a] text-xs mt-0.5">Exclusively For You</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 bg-[#3a3028] rounded-xl p-4 flex flex-col justify-between h-[110px]">
              {/* Top row: arrow only */}
              <div className="flex justify-end">
                <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs shrink-0">↗</button>
              </div>
              {/* Bottom: title + subtitle */}
              <div>
                <p className="text-white font-bold text-sm leading-snug">Need Help Finding Right Product?</p>
                <p className="text-[#c9a98a] text-[10px] mt-2">Get Guidance From Wealth Manager</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
