"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  type Chart,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

const chartData = {
  labels: ["0s", "0.5s", "1s", "1.5s", "2s"],
  datasets: [
    {
      label: "Before (without REFLUX)",
      data: [0, 20, 50, 80, 85],
      borderColor: "#5F6A7A",
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
    },
    {
      label: "After (with REFLUX)",
      data: [0, 5, 10, 15, 18],
      borderColor: "#F15B50",
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
    },
  ],
};

export function LatencyChart() {
  const chartRef = useRef<Chart<"line">>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = chartRef.current;
    const overlay = overlayRef.current;
    if (!chart || !overlay) return;

    const timer = setTimeout(() => {
      const meta0 = chart.getDatasetMeta(0);
      const meta1 = chart.getDatasetMeta(1);
      const pointBefore = meta0.data[4];
      const pointAfter = meta1.data[4];

      if (!pointBefore || !pointAfter) return;

      overlay.innerHTML = "";

      const beforeSpan = document.createElement("span");
      beforeSpan.className =
        "latency-popup popup-before absolute rounded-md border border-[#5F6A7A] bg-[#2A2F38] px-2.5 py-1 text-[13px] font-bold whitespace-nowrap text-[#C0C8D2] opacity-0 transition-opacity duration-400";
      beforeSpan.textContent = "85 ms";
      beforeSpan.style.left = `${pointBefore.x - 20}px`;
      beforeSpan.style.top = `${pointBefore.y - 30}px`;
      overlay.appendChild(beforeSpan);

      const afterSpan = document.createElement("span");
      afterSpan.className =
        "latency-popup popup-after absolute rounded-md border border-reflux-accent-light bg-reflux-accent px-2.5 py-1 text-[13px] font-bold whitespace-nowrap text-white opacity-0 shadow-[0_0_12px_rgba(241,91,80,0.8)] transition-opacity duration-400";
      afterSpan.textContent = "18 ms";
      afterSpan.style.left = `${pointAfter.x - 20}px`;
      afterSpan.style.top = `${pointAfter.y - 30}px`;
      overlay.appendChild(afterSpan);

      setTimeout(() => {
        beforeSpan.classList.add("show");
        afterSpan.classList.add("show");
      }, 50);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto mt-3 w-full max-w-[450px] rounded-2xl border border-reflux-border bg-reflux-card p-3 sm:mt-4 sm:rounded-[20px] sm:p-5">
      <Line
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            duration: 2000,
            easing: "easeOutQuad",
          },
          plugins: {
            legend: {
              labels: { color: "#C0C8D2", font: { size: 12 } },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: "#1E2229" },
              ticks: {
                color: "#9AA4B2",
                callback: (val) => `${val} ms`,
              },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#9AA4B2" },
            },
          },
        }}
      />
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        id="chartOverlay"
      />
    </div>
  );
}
