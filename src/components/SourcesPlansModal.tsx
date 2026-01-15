import { Divider, List, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";

type SourcesPlansModalProps = {
  opened: boolean;
  onClose: () => void;
};

const SourcesPlansModal = ({ opened, onClose }: SourcesPlansModalProps) => (
  <Modal
    opened={opened}
    onClose={onClose}
    centered
    size="lg"
    radius="lg"
    title="Sources & Plans"
  >
    <ScrollArea.Autosize mah={360} type="scroll">
      <Stack gap="md">
        <Stack gap="xs">
          <Title order={4} ff="Fraunces, serif">
            Sources
          </Title>
          <Text size="sm" c="dimmed">
            The current dataset focuses on USA FDA-certified synthetic dyes. Facts
            are summarized from public sources to keep gameplay consistent and
            approachable.
          </Text>
          <List size="sm" spacing="xs">
            <List.Item>
              CSPI Food Dyes: A Rainbow of Risks (2010) — core facts and dye list
              (
              <a
                href="https://www.cspi.org/sites/default/files/attachment/food-dyes-rainbow-of-risks.pdf"
                target="_blank"
                rel="noreferrer"
              >
                PDF
              </a>
              )
            </List.Item>
            <List.Item>
              FDA-certified color additives for foods and ingested drugs
            </List.Item>
          </List>
        </Stack>
        <Divider />
        <Stack gap="xs">
          <Title order={4} ff="Fraunces, serif">
            Planned updates
          </Title>
          <List size="sm" spacing="xs">
            <List.Item>Recalculation for daily dye decisions</List.Item>
            <List.Item>Add more dyes to increase the difficulty</List.Item>
            <List.Item>
              Create local user history so players can review and replay previous
              days
            </List.Item>
            <List.Item>Refine attribute weighting and difficulty tiers</List.Item>
            <List.Item>Improve share formatting and session analytics</List.Item>
          </List>
        </Stack>
      </Stack>
    </ScrollArea.Autosize>
  </Modal>
);

export default SourcesPlansModal;
