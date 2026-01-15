export type ColorFamily = "red" | "yellow" | "blue" | "green" | "other";

export type Tier = "high" | "medium" | "low";

export type RiskFlag = "none" | "caution" | "high";

export type RegulatoryStatus = "allowed" | "warning" | "restricted" | "banned";

export type FoodCategory =
  | "candy"
  | "beverages"
  | "cereal"
  | "snacks"
  | "baked"
  | "dairy"
  | "mixed";

export type AttributeKey =
  | "colorFamily"
  | "usageTier"
  | "riskFlag"
  | "regulatoryStatus"
  | "commonCategories";

export type Feedback =
  | "match"
  | "partial"
  | "no-match"
  | "higher"
  | "lower"
  | "stricter"
  | "looser";

export type AttributeFeedback = {
  key: AttributeKey;
  value: Feedback;
};

export type Dye = {
  id: string;
  displayName: string;
  codeName?: string;
  colorHex?: string;
  colorFamily: ColorFamily;
  usageTier: Tier;
  riskFlag: RiskFlag;
  regulatoryStatus: RegulatoryStatus;
  commonCategories: FoodCategory[];
  facts: string[];
  sources: { title: string; url?: string }[];
};

export type Guess = {
  dyeId: string;
  feedback: AttributeFeedback[];
};

export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  dateKey: string;
  guesses: Guess[];
  status: GameStatus;
  resultsDismissed?: boolean;
};

export type HistoryEntry = {
  dateKey: string;
  status: GameStatus;
  attempts: number;
  shareGrid: string;
};
