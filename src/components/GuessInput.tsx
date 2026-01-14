import type { Dye } from "../types";

type GuessInputProps = {
  dyes: Dye[];
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const GuessInput = ({
  dyes,
  value,
  disabled,
  error,
  onChange,
  onSubmit
}: GuessInputProps) => (
  <div
    className="rounded-2xl border border-ink/10 bg-white/80 p-4 shadow-md"
    onKeyDown={(event) => {
      if (event.key === "Enter" && !disabled) {
        onSubmit();
      }
    }}
  >
    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-inkMuted">
      Choose your dye
    </label>
    <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
      <select
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base shadow-sm focus:border-ink focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Select a dye…</option>
        {dyes.map((dye) => (
          <option key={dye.id} value={dye.id}>
            {dye.displayName}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-parchment transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onSubmit}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
    {error ? (
      <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>
    ) : null}
  </div>
);

export default GuessInput;
