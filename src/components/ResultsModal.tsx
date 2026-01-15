import { Box, Button, Group, List, Modal, Stack, Text, Title } from "@mantine/core";
import type { Dye, GameStatus } from "../types";

const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: 4 }}
  >
    <path d="M14 3h7v7" />
    <path d="M10 14L21 3" />
    <path d="M21 14v7H3V3h7" />
  </svg>
);

type ResultsModalProps = {
  status: GameStatus;
  attempts: number;
  target: Dye;
  onClose: () => void;
  onShare: () => void;
  shareMessage?: string;
  onPractice: () => void;
  isDaily: boolean;
};

const ResultsModal = ({
  status,
  attempts,
  target,
  onClose,
  onShare,
  shareMessage,
  onPractice,
  isDaily
}: ResultsModalProps) => (
  <Modal
    opened
    onClose={onClose}
    centered
    size="lg"
    radius="lg"
    withCloseButton
    title={
      <Text size="xs" tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: "0.2em" }}>
        {status === "won" ? "You solved it" : "Out of guesses"}
      </Text>
    }
  >
    <Stack gap="md">
      <Title order={2} ff="Fraunces, serif">
        {status === "won"
          ? `Solved in ${attempts} attempt${attempts === 1 ? "" : "s"}`
          : "Try again tomorrow"}
      </Title>
      <Stack
        gap="xs"
        p="md"
        style={{ border: "1px solid rgba(18, 17, 23, 0.1)", borderRadius: 16 }}
      >
        <Group gap="xs" align="center">
          <Box
            w={14}
            h={14}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(18, 17, 23, 0.15)",
              backgroundColor: target.colorHex ?? "#d0d0d4"
            }}
          />
          <Text fw={600}>{target.displayName}</Text>
        </Group>
        <List size="sm" spacing="xs">
          {target.facts.map((fact) => (
            <List.Item key={fact}>{fact}</List.Item>
          ))}
        </List>
        <Text size="xs" c="dimmed">
          Sources:{" "}
          {target.sources.map((source, index) => (
            <span key={`${source.title}-${index}`}>
              {source.title}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${source.title}`}
                  style={{ marginLeft: 6 }}
                >
                  <ExternalLinkIcon />
                </a>
              ) : null}
              {index < target.sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </Text>
      </Stack>
      <Group grow>
        <Button radius="md" color="dark" onClick={onShare}>
          Share results
        </Button>
        <Button radius="md" variant="outline" color="dark" onClick={onPractice}>
          {isDaily ? "Practice Mode" : "New DYELE Game"}
        </Button>
      </Group>
      {shareMessage ? (
        <Text size="sm" c="dimmed">
          {shareMessage}
        </Text>
      ) : null}
    </Stack>
  </Modal>
);

export default ResultsModal;
