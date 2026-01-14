import type { Dye, GameStatus } from "../types";

type ResultsModalProps = {
  status: GameStatus;
  attempts: number;
  target: Dye;
  onClose: () => void;
  onShare: () => void;
  onPractice: () => void;
  isDaily: boolean;
};

const ResultsModal = ({
  status,
  attempts,
  target,
  onClose,
  onShare,
  onPractice,
  isDaily
}: ResultsModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
    <div className="w-full max-w-2xl rounded-3xl bg-parchment p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-inkMuted">
            {status === "won" ? "You solved it" : "Out of guesses"}
          </p>
          <h2 className="font-display text-3xl text-ink">
            {status === "won"
              ? `Solved in ${attempts} attempt${attempts === 1 ? "" : "s"}`
              : "Try again tomorrow"}
          </h2>
        </div>
        <button
          type="button"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-inkMuted"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="mt-6 rounded-2xl border border-ink/10 bg-white/80 p-4">
        <h3 className="text-lg font-semibold text-ink">{target.displayName}</h3>
        {target.codeName ? (
          <p className="text-sm text-inkMuted">{target.codeName}</p>
        ) : null}
        <ul className="mt-3 space-y-2 text-sm text-ink">
          {target.facts.map((fact) => (
            <li key={fact}>• {fact}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-inkMuted">
          Sources: {target.sources.join("; ")}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-parchment"
          onClick={onShare}
        >
          Share results
        </button>
        <button
          type="button"
          className="rounded-xl border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink"
          onClick={onPractice}
        >
          {isDaily ? "Play practice" : "New practice"}
        </button>
      </div>
    </div>
  </div>
);

export default ResultsModal;
