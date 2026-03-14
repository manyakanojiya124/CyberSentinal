'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'
import { BarChart2 } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const THREAT_DATA = {
  labels: ['Phishing', 'Malware', 'Data Leaks', 'Spam', 'Ransomware'],
  values: [45, 38, 28, 18, 32],
}

export default function AIStatsChart() {
  const data = {
    labels: THREAT_DATA.labels,
    datasets: [
      {
        label: 'Threat Volume',
        data: THREAT_DATA.values,
        backgroundColor: 'rgba(0, 229, 255, 0.15)',
        borderColor: 'rgba(0, 229, 255, 0.6)',
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(0, 229, 255, 0.25)',
        hoverBorderColor: '#00e5ff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1520',
        borderColor: 'rgba(0,229,255,0.25)',
        borderWidth: 1,
        titleColor: '#00e5ff',
        bodyColor: '#94a3b8',
        titleFont: { family: 'monospace', size: 12 },
        bodyFont: { family: 'monospace', size: 12 },
        padding: 10,
        callbacks: {
          label: (ctx: any) => `  Volume: ${ctx.raw}K incidents`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,229,255,0.05)', drawBorder: false },
        ticks: {
          color: '#4a6070',
          font: { family: 'monospace', size: 11 },
        },
        border: { color: 'rgba(0,229,255,0.1)' },
      },
      y: {
        grid: { color: 'rgba(0,229,255,0.05)', drawBorder: false },
        ticks: {
          color: '#4a6070',
          font: { family: 'monospace', size: 11 },
          callback: (v: any) => v + 'K',
        },
        border: { color: 'rgba(0,229,255,0.1)', dash: [4, 4] },
      },
    },
  }

  return (
    <div className="bg-[#0a1018] border border-cyan-500/15 rounded-xl p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-cyan-500/8 border border-cyan-500/20 rounded-md
          flex items-center justify-center">
          <BarChart2 size={14} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="font-bold text-white text-[15px] tracking-wide">
            Threat Analytics
          </h2>
          <p className="text-[11px] text-gray-600 font-mono tracking-[1px] uppercase">
            Global mock threat volume
          </p>
        </div>
        <div className="ml-auto px-2.5 py-1 bg-cyan-500/8 border border-cyan-500/15 rounded">
          <span className="text-[11px] font-mono text-cyan-600 tracking-[1px]">2025 Q1</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-cyan-500/20 via-cyan-500/5 to-transparent mb-5" />

      {/* Chart */}
      <div className="flex-1 min-h-[260px]">
        <Bar data={data} options={options as any} />
      </div>

      <p className="text-[11px] font-mono text-gray-600 mt-4 text-center tracking-[1px]">
        * Based on aggregated global threat intelligence reports
      </p>
    </div>
  )
}