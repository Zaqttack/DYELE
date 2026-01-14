import AttributeTile from "./AttributeTile";
import { ATTRIBUTE_META } from "../lib/game";
import type { Guess } from "../types";

type GuessRowProps = {
  index: number;
  guess?: Guess;
  displayName?: string;
};

const GuessRow = ({ index, guess, displayName }: GuessRowProps) => {
  const feedbackMap = new Map(guess?.feedback.map((item) => [item.key, item.value]));
  return (
    <div className="grid gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-inkMuted">
          Guess {index + 1}
        </span>
        <span className="font-display text-lg text-ink">
          {displayName ?? "—"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {ATTRIBUTE_META.map((item) => (
          <AttributeTile
            key={item.key}
            label={item.label}
            feedback={feedbackMap.get(item.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuessRow;
