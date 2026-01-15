import type {
  AttributeFeedback,
  AttributeKey,
  Dye,
  Feedback,
  Guess,
  RegulatoryStatus,
  RiskFlag,
  Tier
} from "../types";

export const ATTRIBUTE_META: { key: AttributeKey; label: string }[] = [
  { key: "colorFamily", label: "Color" },
  { key: "usageTier", label: "Usage" },
  { key: "riskFlag", label: "Risk" },
  { key: "regulatoryStatus", label: "Regulation" },
  { key: "commonCategories", label: "Foods" }
];

const ATTRIBUTE_KEYS: AttributeKey[] = ATTRIBUTE_META.map((item) => item.key);
const HIDDEN_ATTRIBUTE_KEYS: AttributeKey[] = ["colorFamily"];
export const VISIBLE_ATTRIBUTE_META = ATTRIBUTE_META.filter(
  (item) => !HIDDEN_ATTRIBUTE_KEYS.includes(item.key)
);
const VISIBLE_ATTRIBUTE_KEYS: AttributeKey[] = VISIBLE_ATTRIBUTE_META.map(
  (item) => item.key
);

const TIER_ORDER: Tier[] = ["low", "medium", "high"];
const RISK_ORDER: RiskFlag[] = ["none", "caution", "high"];
const REG_ORDER: RegulatoryStatus[] = [
  "allowed",
  "warning",
  "restricted",
  "banned"
];

export const hashStringToInt = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const selectDailyDye = (dyes: Dye[], dateKey: string): Dye => {
  const seed = hashStringToInt(dateKey);
  const index = seed % dyes.length;
  return dyes[index];
};

const compareOrdinal = <T extends string>(
  guessValue: T,
  targetValue: T,
  order: T[],
  higherLabel: Feedback,
  lowerLabel: Feedback
): Feedback => {
  if (guessValue === targetValue) {
    return "match";
  }
  const guessIndex = order.indexOf(guessValue);
  const targetIndex = order.indexOf(targetValue);
  return guessIndex < targetIndex ? higherLabel : lowerLabel;
};

export const compareGuessToTarget = (
  guess: Dye,
  target: Dye
): AttributeFeedback[] => {
  const feedback: Record<AttributeKey, Feedback> = {
    colorFamily: guess.colorFamily === target.colorFamily ? "match" : "no-match",
    usageTier: compareOrdinal(
      guess.usageTier,
      target.usageTier,
      TIER_ORDER,
      "higher",
      "lower"
    ),
    riskFlag: compareOrdinal(
      guess.riskFlag,
      target.riskFlag,
      RISK_ORDER,
      "higher",
      "lower"
    ),
    regulatoryStatus: compareOrdinal(
      guess.regulatoryStatus,
      target.regulatoryStatus,
      REG_ORDER,
      "stricter",
      "looser"
    ),
    commonCategories: "no-match"
  };

  const guessSet = new Set(guess.commonCategories);
  const targetSet = new Set(target.commonCategories);
  const hasOverlap = [...guessSet].some((item) => targetSet.has(item));
  if (hasOverlap) {
    feedback.commonCategories = "match";
  } else if (guessSet.has("mixed") || targetSet.has("mixed")) {
    feedback.commonCategories = "partial";
  }

  return ATTRIBUTE_KEYS.map((key) => ({ key, value: feedback[key] }));
};

const feedbackToEmoji = (value: Feedback): string => {
  switch (value) {
    case "match":
      return "🟩";
    case "partial":
    case "higher":
    case "lower":
    case "stricter":
    case "looser":
      return "🟨";
    default:
      return "⬜";
  }
};

export const formatShareGrid = (guesses: Guess[]): string =>
  guesses
    .map((guess) =>
      VISIBLE_ATTRIBUTE_KEYS.map((key) => {
        const feedback = guess.feedback.find((item) => item.key === key);
        return feedback ? feedbackToEmoji(feedback.value) : "⬜";
      }).join("")
    )
    .join("\n");
