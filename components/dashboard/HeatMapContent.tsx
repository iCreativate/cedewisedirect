"use client";
import { useState, useMemo } from "react";

type View = "regions" | "cities" | "categories";
type Metric = "riskCount" | "boundPremiumM" | "lossRatio";
type TimeRange = "30d" | "90d" | "ytd" | "12m";
type LineOfBusiness =
  | "All lines"
  | "Commercial Property"
  | "General Liability"
  | "Business Interruption"
  | "Marine"
  | "Engineering"
  | "Agricultural"
  | "Mining";

type RegionRow = {
  region: string;
  riskCount: number; // exposures / active risks (count)
  submissions: number; // submitted risks (count)
  boundPremiumM: number; // R millions
  lossRatio: number; // 0..1
  avgTivM: number; // R millions
  topRisks: string[];
  trend: number[]; // relative index (not absolute)
};

type CityRow = {
  city: string;
  region: string;
  riskCount: number;
  boundPremiumM: number;
  lossRatio: number;
  trend: number[];
  severityIndex: number; // 0..1
};

type CategoryRow = {
  category: string;
  riskCount: number;
  boundPremiumM: number;
  lossRatio: number;
};

const BASE_REGION_DATA: RegionRow[] = [
  {
    region: "Gauteng",
    riskCount: 1_240,
    submissions: 412,
    boundPremiumM: 64.8,
    lossRatio: 0.56,
    avgTivM: 18.2,
    topRisks: ["Commercial Property", "General Liability", "Business Interruption"],
    trend: [0.92, 0.96, 1.02, 1.08, 1.05, 1.1, 1.14],
  },
  {
    region: "Western Cape",
    riskCount: 980,
    submissions: 306,
    boundPremiumM: 48.3,
    lossRatio: 0.49,
    avgTivM: 16.1,
    topRisks: ["Commercial Property", "Marine", "General Liability"],
    trend: [0.88, 0.93, 0.97, 1.02, 1.01, 1.04, 1.06],
  },
  {
    region: "KwaZulu-Natal",
    riskCount: 760,
    submissions: 254,
    boundPremiumM: 36.9,
    lossRatio: 0.61,
    avgTivM: 14.7,
    topRisks: ["Commercial Property", "Marine", "General Liability"],
    trend: [0.95, 0.99, 1.03, 1.01, 1.05, 1.09, 1.12],
  },
  {
    region: "Eastern Cape",
    riskCount: 520,
    submissions: 188,
    boundPremiumM: 22.4,
    lossRatio: 0.58,
    avgTivM: 11.6,
    topRisks: ["Commercial Property", "Engineering", "General Liability"],
    trend: [0.9, 0.92, 0.96, 0.98, 1.02, 1.01, 1.04],
  },
  {
    region: "Free State",
    riskCount: 410,
    submissions: 144,
    boundPremiumM: 16.7,
    lossRatio: 0.44,
    avgTivM: 9.3,
    topRisks: ["Agricultural", "Commercial Property"],
    trend: [0.86, 0.9, 0.94, 0.95, 0.98, 1.01, 1.0],
  },
  {
    region: "Mpumalanga",
    riskCount: 460,
    submissions: 162,
    boundPremiumM: 19.8,
    lossRatio: 0.63,
    avgTivM: 10.9,
    topRisks: ["Mining", "Commercial Property", "General Liability"],
    trend: [0.93, 0.95, 0.99, 1.02, 1.03, 1.06, 1.08],
  },
  {
    region: "Limpopo",
    riskCount: 330,
    submissions: 118,
    boundPremiumM: 13.2,
    lossRatio: 0.52,
    avgTivM: 8.1,
    topRisks: ["Mining", "Agricultural", "Commercial Property"],
    trend: [0.9, 0.93, 0.94, 0.97, 0.98, 1.01, 1.03],
  },
  {
    region: "North West",
    riskCount: 310,
    submissions: 102,
    boundPremiumM: 12.6,
    lossRatio: 0.47,
    avgTivM: 7.9,
    topRisks: ["Mining", "Commercial Property"],
    trend: [0.88, 0.9, 0.92, 0.95, 0.96, 0.98, 1.0],
  },
  {
    region: "Northern Cape",
    riskCount: 180,
    submissions: 64,
    boundPremiumM: 7.8,
    lossRatio: 0.41,
    avgTivM: 6.4,
    topRisks: ["Mining", "Agricultural"],
    trend: [0.84, 0.86, 0.89, 0.9, 0.92, 0.93, 0.95],
  },
];

const BASE_CITY_DATA: CityRow[] = [
  { city: "Johannesburg", region: "Gauteng", riskCount: 520, boundPremiumM: 28.1, lossRatio: 0.59, trend: [0.95, 0.98, 1.02, 1.06, 1.04, 1.08, 1.12], severityIndex: 0.86 },
  { city: "Pretoria", region: "Gauteng", riskCount: 290, boundPremiumM: 14.6, lossRatio: 0.5, trend: [0.9, 0.93, 0.96, 0.99, 1.0, 1.01, 1.03], severityIndex: 0.62 },
  { city: "Cape Town", region: "Western Cape", riskCount: 420, boundPremiumM: 23.4, lossRatio: 0.47, trend: [0.9, 0.95, 0.97, 1.01, 1.0, 1.03, 1.05], severityIndex: 0.74 },
  { city: "Durban", region: "KwaZulu-Natal", riskCount: 310, boundPremiumM: 17.8, lossRatio: 0.66, trend: [0.96, 0.99, 1.03, 1.02, 1.06, 1.09, 1.13], severityIndex: 0.9 },
  { city: "Gqeberha", region: "Eastern Cape", riskCount: 180, boundPremiumM: 9.6, lossRatio: 0.56, trend: [0.9, 0.92, 0.95, 0.97, 1.0, 1.02, 1.04], severityIndex: 0.6 },
  { city: "Bloemfontein", region: "Free State", riskCount: 140, boundPremiumM: 6.8, lossRatio: 0.43, trend: [0.86, 0.89, 0.92, 0.94, 0.96, 0.99, 1.0], severityIndex: 0.44 },
  { city: "Mbombela", region: "Mpumalanga", riskCount: 160, boundPremiumM: 7.9, lossRatio: 0.64, trend: [0.92, 0.95, 0.99, 1.01, 1.03, 1.06, 1.08], severityIndex: 0.72 },
  { city: "Polokwane", region: "Limpopo", riskCount: 120, boundPremiumM: 5.4, lossRatio: 0.51, trend: [0.9, 0.92, 0.93, 0.96, 0.97, 1.0, 1.02], severityIndex: 0.5 },
];

const BASE_RISK_CATEGORIES: CategoryRow[] = [
  { category: "Commercial Property", riskCount: 1_820, boundPremiumM: 92.4, lossRatio: 0.55 },
  { category: "General Liability", riskCount: 1_080, boundPremiumM: 44.1, lossRatio: 0.49 },
  { category: "Business Interruption", riskCount: 420, boundPremiumM: 19.6, lossRatio: 0.62 },
  { category: "Engineering", riskCount: 210, boundPremiumM: 14.8, lossRatio: 0.58 },
  { category: "Marine", riskCount: 160, boundPremiumM: 11.3, lossRatio: 0.66 },
  { category: "Mining", riskCount: 140, boundPremiumM: 13.7, lossRatio: 0.71 },
  { category: "Agricultural", riskCount: 220, boundPremiumM: 8.9, lossRatio: 0.46 },
];

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function hashToUnit(input: string) {
  // Deterministic, fast, good-enough for UI-only variation
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // 0..1
  return (h >>> 0) / 4294967295;
}

function formatCurrencyM(valueM: number) {
  return `R ${valueM.toFixed(1)}M`;
}

function formatPct01(value01: number) {
  return `${Math.round(value01 * 100)}%`;
}

function metricLabel(metric: Metric) {
  if (metric === "riskCount") return "Active risks";
  if (metric === "boundPremiumM") return "Bound premium";
  return "Loss ratio";
}

function getMetricValue(r: RegionRow, metric: Metric) {
  if (metric === "riskCount") return r.riskCount;
  if (metric === "boundPremiumM") return r.boundPremiumM;
  return r.lossRatio;
}

function getHeatColor(t: number, opacity = 0.9) {
  // blue -> cyan -> yellow -> orange -> red (more "realistic" for risk heat)
  const tt = clamp01(t);
  const hue = 215 - tt * 215; // 215 (blue) -> 0 (red)
  const sat = 85;
  const light = 54 - tt * 6;
  return `hsla(${hue}deg ${sat}% ${light}% / ${opacity})`;
}

function severityChipClass(t: number) {
  if (t >= 0.8) return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20";
  if (t >= 0.6) return "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/20";
  if (t >= 0.4) return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/20";
  if (t >= 0.2) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
  return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20";
}

function TrendBars({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return (
    <div className="flex h-7 items-end gap-0.5">
      {values.map((v, idx) => {
        const h = 20 + ((v - min) / span) * 60;
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className="w-1.5 rounded-sm bg-muted-foreground/30"
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

export default function HeatMapContent() {
  const [selectedView, setSelectedView] = useState<View>("regions");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>("boundPremiumM");
  const [timeRange, setTimeRange] = useState<TimeRange>("90d");
  const [lob, setLob] = useState<LineOfBusiness>("All lines");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const timeFactor: Record<TimeRange, number> = {
    "30d": 0.28,
    "90d": 0.65,
    ytd: 0.85,
    "12m": 1,
  };

  const regionData = useMemo(() => {
    const tf = timeFactor[timeRange];
    return BASE_REGION_DATA.map((r) => {
      const lobJitter = lob === "All lines" ? 1 : 0.88 + hashToUnit(`${r.region}:${lob}`) * 0.34;
      const lrJitter = lob === "All lines" ? 1 : 0.94 + hashToUnit(`${lob}:${r.region}:lr`) * 0.18;
      return {
        ...r,
        riskCount: Math.max(0, Math.round(r.riskCount * tf * lobJitter)),
        submissions: Math.max(0, Math.round(r.submissions * tf * lobJitter)),
        boundPremiumM: Math.max(0, Number((r.boundPremiumM * tf * lobJitter).toFixed(1))),
        lossRatio: clamp01(r.lossRatio * lrJitter),
        avgTivM: Math.max(0, Number((r.avgTivM * (0.95 + (lobJitter - 1) * 0.35)).toFixed(1))),
      };
    });
  }, [lob, timeRange]);

  const cityData = useMemo(() => {
    const tf = timeFactor[timeRange];
    return BASE_CITY_DATA.map((c) => {
      const lobJitter = lob === "All lines" ? 1 : 0.9 + hashToUnit(`${c.city}:${lob}`) * 0.28;
      const lrJitter = lob === "All lines" ? 1 : 0.95 + hashToUnit(`${lob}:${c.city}:lr`) * 0.16;
      return {
        ...c,
        riskCount: Math.max(0, Math.round(c.riskCount * tf * lobJitter)),
        boundPremiumM: Math.max(0, Number((c.boundPremiumM * tf * lobJitter).toFixed(1))),
        lossRatio: clamp01(c.lossRatio * lrJitter),
        severityIndex: clamp01(c.severityIndex * (0.92 + hashToUnit(`${lob}:${c.city}:sev`) * 0.18)),
      };
    });
  }, [lob, timeRange]);

  const categoryData = useMemo(() => {
    const tf = timeFactor[timeRange];
    // If a single LoB is selected, keep categories but bias the selected one up.
    return BASE_RISK_CATEGORIES.map((cat) => {
      const focus = lob !== "All lines" && cat.category === lob ? 1.35 : 1;
      const jitter = 0.92 + hashToUnit(`${cat.category}:${lob}`) * 0.22;
      const m = tf * focus * jitter;
      return {
        ...cat,
        riskCount: Math.max(0, Math.round(cat.riskCount * m)),
        boundPremiumM: Math.max(0, Number((cat.boundPremiumM * m).toFixed(1))),
        lossRatio: clamp01(cat.lossRatio * (0.94 + hashToUnit(`${lob}:${cat.category}:lr`) * 0.18)),
      };
    }).sort((a, b) => b.boundPremiumM - a.boundPremiumM);
  }, [lob, timeRange]);

  const metricRange = useMemo(() => {
    const values = regionData.map((r) => getMetricValue(r, metric));
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, span: max - min || 1 };
  }, [metric, regionData]);

  const regionScore01 = (regionName: string) => {
    const r = regionData.find((x) => x.region === regionName);
    if (!r) return 0;
    const v = getMetricValue(r, metric);
    return clamp01((v - metricRange.min) / metricRange.span);
  };

  const selectedRegionData = selectedRegion ? regionData.find((r) => r.region === selectedRegion) : null;
  const hoveredRegionData = hoveredRegion ? regionData.find((r) => r.region === hoveredRegion) : null;

  const sortedRegions = useMemo(() => {
    const copy = [...regionData];
    copy.sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
    return copy;
  }, [metric, regionData]);

  const sortedCities = useMemo(() => {
    const copy = [...cityData];
    copy.sort((a, b) => b.boundPremiumM - a.boundPremiumM);
    return copy;
  }, [cityData]);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold">Risk Heat Map</h2>
          <p className="text-xs text-muted-foreground">
            Geographic distribution of portfolio exposure and performance
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border bg-background px-2 py-0.5">
              Metric: <span className="font-medium text-foreground">{metricLabel(metric)}</span>
            </span>
            <span className="rounded-full border bg-background px-2 py-0.5">
              Range: <span className="font-medium text-foreground">
                {timeRange === "30d" ? "Last 30 days" : timeRange === "90d" ? "Last 90 days" : timeRange === "ytd" ? "YTD" : "Last 12 months"}
              </span>
            </span>
            <span className="rounded-full border bg-background px-2 py-0.5">
              Line: <span className="font-medium text-foreground">{lob}</span>
            </span>
            <span className="ml-1">Updated ~2h ago</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2 rounded-lg border bg-muted p-1">
          <button
            onClick={() => setSelectedView("regions")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedView === "regions"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Regions
          </button>
          <button
            onClick={() => setSelectedView("cities")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedView === "cities"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cities
          </button>
          <button
            onClick={() => setSelectedView("categories")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedView === "categories"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Categories
          </button>
        </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className="h-9 rounded-lg border bg-background px-3 text-xs font-medium"
            >
              <option value="boundPremiumM">Bound premium</option>
              <option value="riskCount">Active risks</option>
              <option value="lossRatio">Loss ratio</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="h-9 rounded-lg border bg-background px-3 text-xs font-medium"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="ytd">YTD</option>
              <option value="12m">Last 12 months</option>
            </select>
            <select
              value={lob}
              onChange={(e) => setLob(e.target.value as LineOfBusiness)}
              className="h-9 rounded-lg border bg-background px-3 text-xs font-medium"
            >
              <option>All lines</option>
              <option>Commercial Property</option>
              <option>General Liability</option>
              <option>Business Interruption</option>
              <option>Marine</option>
              <option>Engineering</option>
              <option>Agricultural</option>
              <option>Mining</option>
            </select>
          </div>
        </div>
      </div>

      {/* Heat Map Visualization */}
      {selectedView === "regions" && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Regional Risk Distribution</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Low</span>
              <div
                className="h-2 w-40 rounded-full border"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(215 85% 54%) 0%, hsl(190 85% 54%) 25%, hsl(55 90% 56%) 55%, hsl(25 90% 55%) 78%, hsl(0 85% 52%) 100%)",
                }}
                aria-hidden="true"
              />
              <span>High</span>
            </div>
          </div>

          {/* South Africa Map with Heat Overlay */}
          <div className="relative mb-6 overflow-hidden rounded-lg border bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
            {/* Subtle "heat haze" */}
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(800px 400px at 65% 35%, hsla(25deg 90% 55% / 0.18) 0%, transparent 60%), radial-gradient(700px 420px at 35% 55%, hsla(190deg 85% 54% / 0.14) 0%, transparent 60%), radial-gradient(520px 360px at 50% 80%, hsla(0deg 85% 52% / 0.10) 0%, transparent 60%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

            {/* South Africa Map Outline with Provinces - Heat Overlay */}
            <div className="relative z-[2] mx-auto" style={{ maxWidth: "100%", height: "500px" }}>
              <svg 
                viewBox="0 0 800 1000" 
                className="h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="mapShadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)"/>
                  </filter>
                </defs>
                
                {/* Simplified but recognizable South African provinces */}
                {/* Western Cape - Bottom left, coastal shape */}
                <path
                  d="M 120 900 L 120 850 L 140 800 L 180 750 L 220 720 L 260 700 L 280 720 L 300 760 L 280 800 L 240 830 L 200 860 L 150 880 Z"
                  fill={getHeatColor(regionScore01("Western Cape"), 0.85)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Western Cape")}
                  filter={selectedRegion === "Western Cape" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Western Cape")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="220" y="800" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  WC
                </text>

                {/* Northern Cape - Large central area */}
                <path
                  d="M 200 450 L 280 420 L 380 430 L 480 460 L 520 490 L 500 530 L 420 550 L 320 540 L 220 520 L 180 480 Z"
                  fill={getHeatColor(regionScore01("Northern Cape"), 0.78)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Northern Cape")}
                  filter={selectedRegion === "Northern Cape" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Northern Cape")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="360" y="490" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  NC
                </text>

                {/* Eastern Cape - Bottom right, coastal */}
                <path
                  d="M 320 850 L 340 800 L 400 780 L 480 800 L 540 830 L 580 880 L 560 920 L 500 940 L 420 930 L 360 900 Z"
                  fill={getHeatColor(regionScore01("Eastern Cape"), 0.82)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Eastern Cape")}
                  filter={selectedRegion === "Eastern Cape" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Eastern Cape")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="450" y="890" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  EC
                </text>

                {/* Free State - Center */}
                <path
                  d="M 400 580 L 450 560 L 520 570 L 560 610 L 540 660 L 480 680 L 420 670 L 380 630 Z"
                  fill={getHeatColor(regionScore01("Free State"), 0.82)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Free State")}
                  filter={selectedRegion === "Free State" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Free State")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="470" y="625" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  FS
                </text>

                {/* KwaZulu-Natal - East coast */}
                <path
                  d="M 540 780 L 580 750 L 650 740 L 700 770 L 720 820 L 680 860 L 620 870 L 560 850 Z"
                  fill={getHeatColor(regionScore01("KwaZulu-Natal"), 0.88)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("KwaZulu-Natal")}
                  filter={selectedRegion === "KwaZulu-Natal" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("KwaZulu-Natal")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="630" y="815" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  KZN
                </text>

                {/* Gauteng - Small central area */}
                <path
                  d="M 480 600 L 520 580 L 580 590 L 600 630 L 580 670 L 540 680 L 500 660 Z"
                  fill={getHeatColor(regionScore01("Gauteng"), 0.92)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Gauteng")}
                  filter={selectedRegion === "Gauteng" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Gauteng")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="540" y="630" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  GP
                </text>

                {/* Mpumalanga - Northeast */}
                <path
                  d="M 600 630 L 650 620 L 700 640 L 720 680 L 700 720 L 650 730 L 600 710 L 580 670 Z"
                  fill={getHeatColor(regionScore01("Mpumalanga"), 0.84)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Mpumalanga")}
                  filter={selectedRegion === "Mpumalanga" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Mpumalanga")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="650" y="680" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  MP
                </text>

                {/* Limpopo - North */}
                <path
                  d="M 600 480 L 660 460 L 720 480 L 740 530 L 720 580 L 660 590 L 600 570 L 580 520 Z"
                  fill={getHeatColor(regionScore01("Limpopo"), 0.84)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("Limpopo")}
                  filter={selectedRegion === "Limpopo" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("Limpopo")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="660" y="530" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  LP
                </text>

                {/* North West - Northwest */}
                <path
                  d="M 400 480 L 480 460 L 560 480 L 580 530 L 560 580 L 480 590 L 400 570 L 380 520 Z"
                  fill={getHeatColor(regionScore01("North West"), 0.84)}
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedRegion("North West")}
                  filter={selectedRegion === "North West" ? "url(#glow)" : ""}
                  onMouseEnter={() => setHoveredRegion("North West")}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <text x="480" y="530" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-lg">
                  NW
                </text>

                {/* Map Title */}
                <text x="400" y="40" fontSize="20" fill="currentColor" fontWeight="bold" textAnchor="middle" className="text-foreground">
                  South Africa – {metricLabel(metric)}
                </text>
              </svg>
            </div>

            {/* Legend overlay */}
            <div className="absolute bottom-4 right-4 z-[3] max-w-[320px] rounded-lg border border-white/10 bg-black/60 px-4 py-3 text-xs text-white backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Hover for details</div>
                <div className="text-[10px] opacity-80">Click to pin</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] opacity-80">Low</span>
                <div
                  className="h-2 flex-1 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(215 85% 54%) 0%, hsl(190 85% 54%) 25%, hsl(55 90% 56%) 55%, hsl(25 90% 55%) 78%, hsl(0 85% 52%) 100%)",
                  }}
                />
                <span className="text-[10px] opacity-80">High</span>
              </div>
            </div>

            {hoveredRegionData && (
              <div className="absolute left-4 top-4 z-[4] w-[280px] rounded-xl border bg-card/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{hoveredRegionData.region}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {timeRange === "30d" ? "Last 30 days" : timeRange === "90d" ? "Last 90 days" : timeRange === "ytd" ? "YTD" : "Last 12 months"} · {lob}
                    </div>
                  </div>
                  <div className={`rounded-full border px-2 py-0.5 text-[11px] ${severityChipClass(regionScore01(hoveredRegionData.region))}`}>
                    {metricLabel(metric)}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border bg-muted/30 p-2">
                    <div className="text-muted-foreground">Active risks</div>
                    <div className="mt-0.5 text-sm font-semibold">{hoveredRegionData.riskCount.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-2">
                    <div className="text-muted-foreground">Bound premium</div>
                    <div className="mt-0.5 text-sm font-semibold">{formatCurrencyM(hoveredRegionData.boundPremiumM)}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-2">
                    <div className="text-muted-foreground">Loss ratio</div>
                    <div className="mt-0.5 text-sm font-semibold">{formatPct01(hoveredRegionData.lossRatio)}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-2">
                    <div className="text-muted-foreground">Avg TIV</div>
                    <div className="mt-0.5 text-sm font-semibold">{formatCurrencyM(hoveredRegionData.avgTivM)}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-semibold">7-day momentum</div>
                  <div className="mt-1">
                    <TrendBars values={hoveredRegionData.trend} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Region List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedRegions.map((region) => (
              <div
                key={region.region}
                onClick={() => setSelectedRegion(region.region)}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                  selectedRegion === region.region
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: getHeatColor(regionScore01(region.region), 0.95) }}
                      />
                      <h4 className="text-sm font-semibold">{region.region}</h4>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div>Active risks: {region.riskCount.toLocaleString()}</div>
                      <div>Submissions: {region.submissions.toLocaleString()}</div>
                      <div>Bound premium: {formatCurrencyM(region.boundPremiumM)}</div>
                      <div>Loss ratio: {formatPct01(region.lossRatio)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${severityChipClass(regionScore01(region.region))}`}>
                      {metric === "lossRatio"
                        ? formatPct01(region.lossRatio)
                        : metric === "boundPremiumM"
                        ? formatCurrencyM(region.boundPremiumM)
                        : region.riskCount.toLocaleString()}
                    </div>
                    <div className="mt-2 hidden justify-end sm:flex">
                      <TrendBars values={region.trend} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === "cities" && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Top Cities</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Ranked by bound premium. Use this view to spot concentration and emerging loss pockets.
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Geo-coded: <span className="font-medium text-foreground">91%</span></div>
              <div>Data lag: <span className="font-medium text-foreground">~24h</span></div>
            </div>
          </div>

          <div className="space-y-3">
            {sortedCities.map((city) => (
              <div
                key={city.city}
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="relative h-12 w-12 rounded-full border text-white shadow-sm"
                    style={{ backgroundColor: getHeatColor(city.severityIndex, 0.92) }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 rounded-full opacity-70 blur-[10px]" style={{ backgroundColor: getHeatColor(city.severityIndex, 0.6) }} />
                    <div className="relative flex h-12 w-12 items-center justify-center font-bold text-sm drop-shadow">
                      {city.city.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{city.city}</div>
                    <div className="text-xs text-muted-foreground">{city.region}</div>
                    <div className="mt-1 hidden sm:block">
                      <TrendBars values={city.trend} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrencyM(city.boundPremiumM)}</div>
                  <div className="text-xs text-muted-foreground">
                    {city.riskCount.toLocaleString()} risks · LR {formatPct01(city.lossRatio)}
                  </div>
                  <div className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${severityChipClass(city.severityIndex)}`}>
                    Severity index {Math.round(city.severityIndex * 100)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === "categories" && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Risk Categories</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Mix of exposure and performance by line. Use loss ratio to sanity-check pricing adequacy.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Portfolio coverage: <span className="font-medium text-foreground">98%</span>
            </div>
          </div>
          <div className="space-y-4">
            {categoryData.map((category) => {
              const totalRisks = categoryData.reduce((sum, c) => sum + c.riskCount, 0) || 1;
              const share = (category.riskCount / totalRisks) * 100;
              const sev = clamp01((category.lossRatio - 0.35) / 0.5);
              return (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.category}</span>
                  <div className="text-right">
                    <span className="font-semibold">{category.riskCount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1">({share.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(2, Math.min(100, share))}%`,
                      background: getHeatColor(sev, 0.9),
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>Bound premium: <span className="font-medium text-foreground">{formatCurrencyM(category.boundPremiumM)}</span></span>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 ${severityChipClass(sev)}`}>
                    LR {formatPct01(category.lossRatio)}
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {/* Selected Region Details */}
      {selectedRegionData && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Risk Details: {selectedRegionData.region}</h3>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Active risks</div>
                <div className="mt-1 text-2xl font-semibold">{selectedRegionData.riskCount.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Bound premium volume</div>
                <div className="mt-1 text-2xl font-semibold">{formatCurrencyM(selectedRegionData.boundPremiumM)}</div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Loss ratio</div>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: getHeatColor(regionScore01(selectedRegionData.region), 0.95) }}
                  />
                  <span className="text-lg font-semibold">{formatPct01(selectedRegionData.lossRatio)}</span>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Avg total insured value</div>
                <div className="mt-1 text-2xl font-semibold">{formatCurrencyM(selectedRegionData.avgTivM)}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-3 text-sm font-semibold">Top Risk Types</h4>
                <div className="space-y-2">
                  {selectedRegionData.topRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                      <span className="text-sm">{risk}</span>
                      <div
                        className="h-2 w-2 rounded-full border"
                        style={{ backgroundColor: getHeatColor(0.85 - idx * 0.18, 0.95) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Avg premium per risk</div>
                <div className="mt-1 text-lg font-semibold">
                  {(() => {
                    const perRisk = selectedRegionData.riskCount > 0 ? (selectedRegionData.boundPremiumM * 1_000_000) / selectedRegionData.riskCount : 0;
                    return `R ${Math.round(perRisk).toLocaleString()}`;
                  })()}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Momentum (7 days)</div>
                <div className="mt-2">
                  <TrendBars values={selectedRegionData.trend} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Regions</div>
          <div className="mt-1 text-xl font-semibold">{regionData.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Active risks</div>
          <div className="mt-1 text-xl font-semibold">{regionData.reduce((sum, r) => sum + r.riskCount, 0).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Bound premium</div>
          <div className="mt-1 text-xl font-semibold">{formatCurrencyM(regionData.reduce((sum, r) => sum + r.boundPremiumM, 0))}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">High severity regions</div>
          <div className="mt-1 text-xl font-semibold">
            {regionData.filter((r) => regionScore01(r.region) >= 0.8).length}
          </div>
        </div>
      </div>
    </div>
  );
}

