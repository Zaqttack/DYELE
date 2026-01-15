import { Box, Button, Group, List, Modal, Stack, Text, Title } from "@mantine/core";
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
          Sources: {target.sources.join("; ")}
        </Text>
      </Stack>
      <Group grow>
        <Button radius="md" color="dark" onClick={onShare}>
          Share results
        </Button>
        <Button radius="md" variant="outline" color="dark" onClick={onPractice}>
          {isDaily ? "Play practice" : "New practice"}
        </Button>
      </Group>
    </Stack>
  </Modal>
);

export default ResultsModal;
