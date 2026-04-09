"use client";
import { useState, useMemo, useRef, useEffect } from "react";

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

const REGION_DOT_POSITIONS: Record<string, { xPct: number; yPct: number }> = {
  Gauteng: { xPct: 67.5, yPct: 47 },
  "Western Cape": { xPct: 48, yPct: 79 },
  "KwaZulu-Natal": { xPct: 73.5, yPct: 67 },
  "Eastern Cape": { xPct: 60, yPct: 79 },
  "Free State": { xPct: 60.5, yPct: 59.5 },
  Mpumalanga: { xPct: 76.5, yPct: 52.5 },
  Limpopo: { xPct: 74.5, yPct: 36.5 },
  "North West": { xPct: 57.5, yPct: 46.5 },
  "Northern Cape": { xPct: 35.5, yPct: 56 },
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

// Expanded South African cities/towns list (UI-only). Metrics are generated deterministically.
const SA_CITIES: { city: string; region: string }[] = [
  // Gauteng
  { city: "Soweto", region: "Gauteng" },
  { city: "Sandton", region: "Gauteng" },
  { city: "Midrand", region: "Gauteng" },
  { city: "Centurion", region: "Gauteng" },
  { city: "Kempton Park", region: "Gauteng" },
  { city: "Benoni", region: "Gauteng" },
  { city: "Boksburg", region: "Gauteng" },
  { city: "Germiston", region: "Gauteng" },
  { city: "Vereeniging", region: "Gauteng" },
  { city: "Krugersdorp", region: "Gauteng" },
  // Western Cape
  { city: "Stellenbosch", region: "Western Cape" },
  { city: "Paarl", region: "Western Cape" },
  { city: "George", region: "Western Cape" },
  { city: "Mossel Bay", region: "Western Cape" },
  { city: "Worcester", region: "Western Cape" },
  { city: "Somerset West", region: "Western Cape" },
  { city: "Knysna", region: "Western Cape" },
  // KwaZulu-Natal
  { city: "Pietermaritzburg", region: "KwaZulu-Natal" },
  { city: "Richards Bay", region: "KwaZulu-Natal" },
  { city: "Newcastle", region: "KwaZulu-Natal" },
  { city: "Empangeni", region: "KwaZulu-Natal" },
  { city: "Ladysmith", region: "KwaZulu-Natal" },
  // Eastern Cape
  { city: "East London", region: "Eastern Cape" },
  { city: "Mthatha", region: "Eastern Cape" },
  { city: "Queenstown", region: "Eastern Cape" },
  { city: "Grahamstown (Makhanda)", region: "Eastern Cape" },
  // Free State
  { city: "Welkom", region: "Free State" },
  { city: "Kroonstad", region: "Free State" },
  { city: "Sasolburg", region: "Free State" },
  // Mpumalanga
  { city: "eMalahleni (Witbank)", region: "Mpumalanga" },
  { city: "Secunda", region: "Mpumalanga" },
  { city: "Middelburg", region: "Mpumalanga" },
  // Limpopo
  { city: "Tzaneen", region: "Limpopo" },
  { city: "Thohoyandou", region: "Limpopo" },
  { city: "Mokopane", region: "Limpopo" },
  // North West
  { city: "Rustenburg", region: "North West" },
  { city: "Mahikeng", region: "North West" },
  { city: "Potchefstroom", region: "North West" },
  { city: "Klerksdorp", region: "North West" },
  // Northern Cape
  { city: "Kimberley", region: "Northern Cape" },
  { city: "Upington", region: "Northern Cape" },
  { city: "Springbok", region: "Northern Cape" },
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
  const [selectedCity, setSelectedCity] = useState<CityRow | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [focusedCity, setFocusedCity] = useState<string | null>(null);
  const cityRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedView !== "cities" || !focusedCity) return;
    const el = cityRowRefs.current[focusedCity];
    if (!el) return;
    // Wait a tick for layout to settle after view switch.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusedCity, selectedView]);

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
    const generated: CityRow[] = SA_CITIES.map((c) => {
      const u = hashToUnit(c.city);
      const u2 = hashToUnit(`${c.city}:${c.region}`);
      const baseRisk = 40 + Math.round(u * 420); // 40..460
      const basePremium = 1.2 + u2 * 18.5; // 1.2..19.7
      const baseLR = clamp01(0.28 + hashToUnit(`${c.city}:lr`) * 0.55); // ~0.28..0.83
      const baseSev = clamp01(0.3 + hashToUnit(`${c.city}:sev`) * 0.65); // ~0.30..0.95
      const trendBase = 0.88 + hashToUnit(`${c.city}:t`) * 0.18;
      const trend = Array.from({ length: 7 }, (_, i) => trendBase + Math.sin((i / 6) * Math.PI) * 0.08);
      return {
        city: c.city,
        region: c.region,
        riskCount: baseRisk,
        boundPremiumM: Number(basePremium.toFixed(1)),
        lossRatio: baseLR,
        severityIndex: baseSev,
        trend,
      };
    });

    const all = [...BASE_CITY_DATA, ...generated].reduce<CityRow[]>((acc, c) => {
      if (acc.some((x) => x.city === c.city)) return acc;
      acc.push(c);
      return acc;
    }, []);

    return all.map((c) => {
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
            <div>
              <h3 className="text-base font-semibold">Heat Map</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Click a region dot to view details.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="relative overflow-hidden rounded-2xl border bg-background">
              <div
                className="relative aspect-[16/8] w-full"
                style={{
                  backgroundImage: "url(/heatmap/heatmap.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* subtle glass overlay like the reference */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(900px 420px at 25% 25%, rgba(255,255,255,0.10) 0%, transparent 62%), linear-gradient(0deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05))",
                  }}
                  aria-hidden="true"
                />

                {/* Region dots */}
                {sortedRegions.map((r) => {
                  const pos = REGION_DOT_POSITIONS[r.region] ?? { xPct: 65, yPct: 50 };
                  const score = regionScore01(r.region);
                  const color = getHeatColor(score, 0.95);
                  const selected = selectedRegion === r.region;
                  const hovered = hoveredRegion === r.region;
                  const size = 16 + Math.round(score * 12); // 16..28 (more visible)
                  const halo = size + 16;

                  return (
                    <button
                      key={r.region}
                      type="button"
                      className="group absolute"
                      style={{
                        left: `${pos.xPct}%`,
                        top: `${pos.yPct}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      aria-label={`Select ${r.region}`}
                      onClick={() => setSelectedRegion(r.region)}
                      onMouseEnter={() => setHoveredRegion(r.region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      {/* halo/glow to increase contrast on busy map tiles */}
                      <span
                        className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          width: `${halo}px`,
                          height: `${halo}px`,
                          background:
                            selected || hovered
                              ? "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.14) 42%, rgba(255,255,255,0) 70%)"
                              : "radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0) 68%)",
                          filter: "blur(0.2px)",
                        }}
                        aria-hidden="true"
                      />

                      <span
                        className="relative block rounded-full border border-white/90 shadow-[0_18px_34px_rgba(0,0,0,0.35)]"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          backgroundColor: color,
                          outline: selected
                            ? "4px solid rgba(255,255,255,0.95)"
                            : hovered
                              ? "3px solid rgba(255,255,255,0.92)"
                              : "2px solid rgba(0,0,0,0.45)",
                          outlineOffset: 2,
                          transition: "transform 120ms ease, outline 120ms ease, box-shadow 120ms ease",
                          transform: hovered || selected ? "scale(1.08)" : "scale(1)",
                          boxShadow:
                            hovered || selected
                              ? "0 22px 40px rgba(0,0,0,0.42)"
                              : "0 18px 34px rgba(0,0,0,0.32)",
                        }}
                      />
                      {/* Tooltip */}
                      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border bg-background/95 px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur group-hover:block">
                        {r.region}
                      </span>
                    </button>
                  );
                })}

                {selectedRegionData && (
                  <div className="absolute left-4 top-4 z-[5] w-[320px] rounded-2xl border border-white/20 bg-black/60 p-4 text-white shadow-xl backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{selectedRegionData.region}</div>
                        <div className="mt-0.5 text-xs text-white/80">Risk details</div>
                      </div>
                      <button
                        type="button"
                        className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/15"
                        onClick={() => setSelectedRegion(null)}
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg border border-white/15 bg-white/10 p-2">
                        <div className="text-white/70">Active risks</div>
                        <div className="mt-0.5 text-sm font-semibold">{selectedRegionData.riskCount.toLocaleString()}</div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/10 p-2">
                        <div className="text-white/70">Bound premium</div>
                        <div className="mt-0.5 text-sm font-semibold">{formatCurrencyM(selectedRegionData.boundPremiumM)}</div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/10 p-2">
                        <div className="text-white/70">Loss ratio</div>
                        <div className="mt-0.5 text-sm font-semibold">{formatPct01(selectedRegionData.lossRatio)}</div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/10 p-2">
                        <div className="text-white/70">Avg TIV</div>
                        <div className="mt-0.5 text-sm font-semibold">{formatCurrencyM(selectedRegionData.avgTivM)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {[
                { t: "Low", v: 0.1 },
                { t: "Guarded", v: 0.3 },
                { t: "Elevated", v: 0.5 },
                { t: "High", v: 0.7 },
                { t: "Critical", v: 0.9 },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                  <div className="h-6 w-6 rounded border" style={{ backgroundColor: getHeatColor(x.v, 0.95) }} aria-hidden="true" />
                  <div className="text-sm font-semibold">{x.t}</div>
                </div>
              ))}
            </div>
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

          {selectedCity && (
            <div className="mb-4 rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{selectedCity.city}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{selectedCity.region}</div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border bg-background px-2 py-1 text-xs font-semibold hover:bg-muted"
                  onClick={() => setSelectedCity(null)}
                >
                  Close
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border bg-background p-2">
                  <div className="text-muted-foreground">Active risks</div>
                  <div className="mt-0.5 text-sm font-semibold">{selectedCity.riskCount.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border bg-background p-2">
                  <div className="text-muted-foreground">Bound premium</div>
                  <div className="mt-0.5 text-sm font-semibold">{formatCurrencyM(selectedCity.boundPremiumM)}</div>
                </div>
                <div className="rounded-lg border bg-background p-2">
                  <div className="text-muted-foreground">Loss ratio</div>
                  <div className="mt-0.5 text-sm font-semibold">{formatPct01(selectedCity.lossRatio)}</div>
                </div>
                <div className="rounded-lg border bg-background p-2">
                  <div className="text-muted-foreground">Impact index</div>
                  <div className="mt-0.5 text-sm font-semibold">{Math.round(selectedCity.severityIndex * 100)}%</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {sortedCities.map((city) => (
              <div
                key={city.city}
                ref={(el) => {
                  cityRowRefs.current[city.city] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open ${city.city} details`}
                onClick={() => setSelectedCity(city)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedCity(city);
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg border bg-card p-4 transition-shadow ${
                  focusedCity === city.city ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm" : "hover:shadow-sm"
                }`}
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

