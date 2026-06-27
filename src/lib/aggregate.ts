import { Grant } from "@/lib/types";

export function formatUsd(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

export interface CompanyAgg {
  company: string;
  country: Grant["country"];
  totalUsd: number;
  count: number;
}

export function rankByCompany(grants: Grant[]): CompanyAgg[] {
  const map = new Map<string, CompanyAgg>();
  for (const g of grants) {
    const key = `${g.company}__${g.country}`;
    const existing = map.get(key);
    if (existing) {
      existing.totalUsd += g.amountUsd;
      existing.count += 1;
    } else {
      map.set(key, {
        company: g.company,
        country: g.country,
        totalUsd: g.amountUsd,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
}

export interface ThemeAgg {
  theme: string;
  totalUsd: number;
  count: number;
}

export function aggregateByTheme(grants: Grant[]): ThemeAgg[] {
  const map = new Map<string, ThemeAgg>();
  for (const g of grants) {
    const existing = map.get(g.theme);
    if (existing) {
      existing.totalUsd += g.amountUsd;
      existing.count += 1;
    } else {
      map.set(g.theme, { theme: g.theme, totalUsd: g.amountUsd, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
}

export interface CountryAgg {
  country: Grant["country"];
  totalUsd: number;
  count: number;
}

export function aggregateByCountry(grants: Grant[]): CountryAgg[] {
  const map = new Map<string, CountryAgg>();
  for (const g of grants) {
    const existing = map.get(g.country);
    if (existing) {
      existing.totalUsd += g.amountUsd;
      existing.count += 1;
    } else {
      map.set(g.country, { country: g.country, totalUsd: g.amountUsd, count: 1 });
    }
  }
  return Array.from(map.values());
}

export interface YearAgg {
  fiscalYear: number;
  US: number;
  JP: number;
  total: number;
}

export function aggregateByYear(grants: Grant[]): YearAgg[] {
  const map = new Map<number, YearAgg>();
  for (const g of grants) {
    let entry = map.get(g.fiscalYear);
    if (!entry) {
      entry = { fiscalYear: g.fiscalYear, US: 0, JP: 0, total: 0 };
      map.set(g.fiscalYear, entry);
    }
    entry[g.country] += g.amountUsd;
    entry.total += g.amountUsd;
  }
  return Array.from(map.values()).sort((a, b) => a.fiscalYear - b.fiscalYear);
}

export interface AgencyAgg {
  agency: string;
  country: Grant["country"];
  totalUsd: number;
  count: number;
}

export function aggregateByAgency(grants: Grant[]): AgencyAgg[] {
  const map = new Map<string, AgencyAgg>();
  for (const g of grants) {
    const existing = map.get(g.agency);
    if (existing) {
      existing.totalUsd += g.amountUsd;
      existing.count += 1;
    } else {
      map.set(g.agency, {
        agency: g.agency,
        country: g.country,
        totalUsd: g.amountUsd,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
}
