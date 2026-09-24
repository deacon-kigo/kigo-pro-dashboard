import { TONE, type Tone } from "./tone";

const StatusPill = ({ color, children }: { color: Tone; children: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${TONE[color].pill}`}
  >
    <span aria-hidden className={`size-1.5 rounded-full ${TONE[color].dot}`} />
    {children}
  </span>
);

export { StatusPill };
