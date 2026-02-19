"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  CircleDollarSign,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const CURRENCIES = [
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
];

// Mock exchange rates (as of a hypothetical date)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 18.5, // 1 USD = 18.5 ZAR
  EUR: 20.2, // 1 EUR = 20.2 ZAR
  GBP: 23.4, // 1 GBP = 23.4 ZAR
  JPY: 0.125, // 1 JPY = 0.125 ZAR
  AUD: 12.3, // 1 AUD = 12.3 ZAR
  CAD: 13.6, // 1 CAD = 13.6 ZAR
  CHF: 20.8, // 1 CHF = 20.8 ZAR
  CNY: 2.6, // 1 CNY = 2.6 ZAR
  INR: 0.22, // 1 INR = 0.22 ZAR
  ZAR: 1, // Base currency
};

const RECENT_CONVERSIONS = [
  { from: "ZAR", to: "USD", amount: 185000, converted: 10000, date: "2024-12-15" },
  { from: "EUR", to: "ZAR", amount: 5000, converted: 101000, date: "2024-12-14" },
  { from: "GBP", to: "USD", amount: 2000, converted: 2530, date: "2024-12-13" },
  { from: "ZAR", to: "EUR", amount: 250000, converted: 12376, date: "2024-12-12" },
  { from: "USD", to: "ZAR", amount: 15000, converted: 277500, date: "2024-12-11" },
];

export default function CurrencyConvertorContent() {
  const [fromCurrency, setFromCurrency] = useState("ZAR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  const convertCurrency = useCallback(() => {
    if (!amount || isNaN(Number(amount))) {
      setConvertedAmount("");
      return;
    }

    const amountNum = Number(amount);
    
    // Convert to ZAR first, then to target currency
    let zarAmount = amountNum;
    if (fromCurrency !== "ZAR") {
      zarAmount = amountNum * EXCHANGE_RATES[fromCurrency];
    }

    let result = zarAmount;
    if (toCurrency !== "ZAR") {
      result = zarAmount / EXCHANGE_RATES[toCurrency];
    }

    setConvertedAmount(result.toFixed(2));
  }, [amount, fromCurrency, toCurrency]);

  // Auto-convert when amount or currencies change
  useEffect(() => {
    convertCurrency();
  }, [convertCurrency]);

  const swapCurrencies = () => {
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;
    setFromCurrency(tempTo);
    setToCurrency(tempFrom);
    const tempAmount = amount;
    const tempConverted = convertedAmount;
    setAmount(tempConverted);
    setConvertedAmount(tempAmount);
  };

  const refreshRates = () => {
    setLastUpdated(new Date().toLocaleString());
    // In a real app, this would fetch latest rates from an API
  };

  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    if (from === "ZAR") return 1 / EXCHANGE_RATES[to];
    if (to === "ZAR") return EXCHANGE_RATES[from];
    // Convert from -> ZAR -> to
    return EXCHANGE_RATES[from] / EXCHANGE_RATES[to];
  };

  const currentRate = getRate(fromCurrency, toCurrency);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">USD Rate</div>
              <div className="mt-1 text-2xl font-semibold">R {EXCHANGE_RATES.USD.toFixed(2)}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+0.5% today</div>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">EUR Rate</div>
              <div className="mt-1 text-2xl font-semibold">R {EXCHANGE_RATES.EUR.toFixed(2)}</div>
              <div className="mt-1 text-xs text-red-600 dark:text-red-400">-0.3% today</div>
            </div>
            <CircleDollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">GBP Rate</div>
              <div className="mt-1 text-2xl font-semibold">R {EXCHANGE_RATES.GBP.toFixed(2)}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+0.8% today</div>
            </div>
            <CircleDollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">JPY Rate</div>
              <div className="mt-1 text-2xl font-semibold">R {EXCHANGE_RATES.JPY.toFixed(3)}</div>
              <div className="mt-1 text-xs text-muted-foreground">+0.1% today</div>
            </div>
            <CircleDollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Currency Converter</h3>
          <button
            onClick={refreshRates}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-muted bg-background px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Rates
          </button>
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Last updated: {lastUpdated}
        </div>

        <div className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex gap-4">
              <select
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value);
                }}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder="Enter amount"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="rounded-full border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Swap currencies"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex gap-4">
              <select
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value);
                }}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={convertedAmount || ""}
                readOnly
                placeholder="Converted amount"
                className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Exchange Rate Display */}
          {amount && convertedAmount && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-sm font-medium">
                {CURRENCIES.find((c) => c.code === fromCurrency)?.symbol} {Number(amount).toLocaleString()} {fromCurrency} = {CURRENCIES.find((c) => c.code === toCurrency)?.symbol} {Number(convertedAmount).toLocaleString()} {toCurrency}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Exchange Rate: 1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Exchange Rates (to ZAR)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Currency</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {CURRENCIES.filter((c) => c.code !== "ZAR").map((currency) => {
                const rate = EXCHANGE_RATES[currency.code];
                const change = Math.random() > 0.5 ? 0.5 : -0.3; // Mock change
                return (
                  <tr key={currency.code} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-muted-foreground">{currency.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium">
                      R {rate.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <div className={`flex items-center justify-end gap-1 ${change > 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{change > 0 ? "+" : ""}{change}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Conversions */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Recent Conversions</h3>
        <div className="space-y-3">
          {RECENT_CONVERSIONS.map((conversion, idx) => {
            const fromCurr = CURRENCIES.find((c) => c.code === conversion.from);
            const toCurr = CURRENCIES.find((c) => c.code === conversion.to);
            return (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{fromCurr?.flag}</span>
                    <span className="text-sm font-medium">{conversion.from}</span>
                  </div>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{toCurr?.flag}</span>
                    <span className="text-sm font-medium">{conversion.to}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {fromCurr?.symbol} {conversion.amount.toLocaleString()} → {toCurr?.symbol} {conversion.converted.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(conversion.date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

