import {
  Button,
  Checkbox,
  Group,
  List,
  Modal,
  Spoiler,
  Stack,
  Text,
  Title
} from "@mantine/core";

type IntroModalProps = {
  opened: boolean;
  onClose: () => void;
  dontShowAgain: boolean;
  onToggleDontShowAgain: (value: boolean) => void;
};

const IntroModal = ({
  opened,
  onClose,
  dontShowAgain,
  onToggleDontShowAgain
}: IntroModalProps) => (
  <Modal opened={opened} onClose={onClose} centered size="lg" radius="lg" title="How it works">
    <Stack gap="md">
      <Stack gap="xs">
        <Title order={4} ff="Fraunces, serif">
          Premise
        </Title>
        <Text size="sm" c="dimmed">
          DYELE is a daily deduction game where you guess a mystery food dye. Each
          guess returns attribute feedback so you can narrow it down.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Title order={4} ff="Fraunces, serif">
          How to play
        </Title>
        <List size="sm" spacing="xs">
          <List.Item>You have 4 attempts to find the daily dye.</List.Item>
          <List.Item>Each guess reveals feedback across multiple attributes.</List.Item>
          <List.Item>Matches are green; partial or directional hints are yellow.</List.Item>
          <List.Item>Practice mode lets you reset as much as you want.</List.Item>
        </List>
      </Stack>

      <Stack gap="xs">
        <Title order={4} ff="Fraunces, serif">
          Why dyes
        </Title>
        <Text size="sm" c="dimmed">
          Food color additives are regulated in the U.S. by the FDA. This game is
          a lightweight way to learn about dyes and the attributes used to compare
          them.
        </Text>
        <Spoiler showLabel="More about food dyes" hideLabel="Hide details">
          <Text size="sm" c="dimmed">
            Synthetic food dyes are color additives used to make foods look more
            consistent or vivid. Some dyes are subject to FDA batch certification,
            and labels often list FD&amp;C color names. DYELE focuses on consistent,
            defensible categories rather than perfect scientific scoring.
          </Text>
        </Spoiler>
      </Stack>

      <Group justify="space-between" align="center">
        <Checkbox
          label="Don’t show this again"
          checked={dontShowAgain}
          onChange={(event) => onToggleDontShowAgain(event.currentTarget.checked)}
        />
        <Button color="dark" onClick={onClose}>
          Got it
        </Button>
      </Group>
    </Stack>
  </Modal>
);

export default IntroModal;
