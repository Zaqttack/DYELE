import type { Feedback } from "../types";

const feedbackLabel = (feedback: Feedback): string => {
  switch (feedback) {
    case "match":
      return "Match";
    case "partial":
      return "Partial";
    case "higher":
      return "Higher";
    case "lower":
      return "Lower";
    case "stricter":
      return "Stricter";
    case "looser":
      return "Looser";
    default:
      return "No match";
  }
};

const feedbackClasses = (feedback?: Feedback): string => {
  if (!feedback) {
    return "bg-white/70 border border-ink/10 text-inkMuted";
  }
  switch (feedback) {
    case "match":
      return "bg-match text-white";
    case "partial":
    case "higher":
    case "lower":
    case "stricter":
    case "looser":
      return "bg-hint text-ink";
    default:
      return "bg-miss text-inkMuted";
  }
};

type AttributeTileProps = {
  label: string;
  feedback?: Feedback;
};

const AttributeTile = ({ label, feedback }: AttributeTileProps) => (
  <div
    className={`flex flex-col items-center justify-center rounded-xl px-2 py-3 text-xs font-semibold uppercase tracking-wide shadow-tile ${feedbackClasses(
      feedback
    )}`}
  >
    <span className="text-[0.6rem] opacity-70">{label}</span>
    <span className="text-sm normal-case">
      {feedback ? feedbackLabel(feedback) : "—"}
    </span>
  </div>
);

export default AttributeTile;
