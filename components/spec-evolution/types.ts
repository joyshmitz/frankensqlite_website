export interface Commit {
  idx: number;
  hash: string;
  short: string;
  date: string;
  author: string;
  subject: string;
  add: number;
  del: number;
  impact: number;
  primary: number;
  labels: number[];
}

export interface Bucket {
  id: number;
  name: string;
  color: string;
  desc: string;
}

export interface MetricsEntry {
  lines: number;
  tokens: number;
  lev: number;
}

export type Tab = "spec" | "timeline" | "diff";
export type DiffMode = "line-by-line" | "side-by-side";
export type TimeBucket = "day" | "hour" | "15m" | "5m";
