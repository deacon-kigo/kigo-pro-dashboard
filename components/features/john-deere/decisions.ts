import type { DisputeStatus, InvoiceStatus } from "./data";

const KEY = "kigo-jd-review";
const EVENT = "kigo-jd-review";

interface Decisions {
  invoices: Record<string, InvoiceStatus>;
  disputes: Record<string, DisputeStatus>;
}

const empty = (): Decisions => ({ invoices: {}, disputes: {} });

const readDecisions = (): Decisions => {
  if (typeof window === "undefined") return empty();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Decisions;
    return { invoices: parsed.invoices ?? {}, disputes: parsed.disputes ?? {} };
  } catch {
    return empty();
  }
};

const write = (next: Decisions) => {
  sessionStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
};

const saveInvoice = (id: string, status: InvoiceStatus) => {
  const current = readDecisions();
  current.invoices[id] = status;
  write(current);
};

const saveDispute = (id: string, status: DisputeStatus) => {
  const current = readDecisions();
  current.disputes[id] = status;
  write(current);
};

export { EVENT, readDecisions, saveDispute, saveInvoice };
