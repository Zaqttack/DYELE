import { Divider, List, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";

type ChangeLogEntry = {
  date: string;
  items: string[];
};

type ChangeLogModalProps = {
  opened: boolean;
  onClose: () => void;
  entries: ChangeLogEntry[];
};

const ChangeLogModal = ({ opened, onClose, entries }: ChangeLogModalProps) => (
  <Modal opened={opened} onClose={onClose} centered size="lg" radius="lg" title="Changelog">
    <ScrollArea.Autosize mah={360} type="scroll">
      <Stack gap="md">
        {entries.map((entry, index) => (
          <Stack key={`${entry.date}-${index}`} gap="xs">
            <Title order={4} ff="Fraunces, serif">
              {entry.date}
            </Title>
            <List size="sm" spacing="xs">
              {entry.items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
              ))}
            </List>
            {index < entries.length - 1 ? <Divider /> : null}
          </Stack>
        ))}
        {entries.length === 0 ? (
          <Text size="sm" c="dimmed">
            No releases yet. Check back after the first launch.
          </Text>
        ) : null}
      </Stack>
    </ScrollArea.Autosize>
  </Modal>
);

export default ChangeLogModal;
