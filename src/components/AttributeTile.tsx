import { Paper, Stack, Text } from "@mantine/core";
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

const feedbackStyles = (
  feedback?: Feedback
): { backgroundColor: string; color: string } => {
  if (!feedback) {
    return { backgroundColor: "rgba(255, 255, 255, 0.8)", color: "#4d4b52" };
  }
  switch (feedback) {
    case "match":
      return { backgroundColor: "#4f9a5f", color: "#ffffff" };
    case "partial":
    case "higher":
    case "lower":
    case "stricter":
    case "looser":
      return { backgroundColor: "#d9b24c", color: "#121117" };
    default:
      return { backgroundColor: "#d0d0d4", color: "#4d4b52" };
  }
};

type AttributeTileProps = {
  label: string;
  feedback?: Feedback;
};

const AttributeTile = ({ label, feedback }: AttributeTileProps) => (
  <Paper
    radius="md"
    p="sm"
    shadow="sm"
    withBorder
    style={feedbackStyles(feedback)}
  >
    <Stack gap={4} align="center">
      <Text size="xs" tt="uppercase" fw={600} style={{ opacity: 0.7 }}>
        {label}
      </Text>
      <Text size="sm" fw={600}>
        {feedback ? feedbackLabel(feedback) : "—"}
      </Text>
    </Stack>
  </Paper>
);

export default AttributeTile;
