import { Divider, List, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";

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
            The current dataset highlights commonly discussed synthetic dyes in
            U.S. foods. Facts are summarized from public sources so the game stays
            consistent and approachable.
          </Text>
          <List size="sm" spacing="xs">
            <List.Item>
              CSPI Food Dyes: A Rainbow of Risks (2010) — core facts and dye list
              <a
                href="https://www.cspi.org/sites/default/files/attachment/food-dyes-rainbow-of-risks.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label="Open CSPI Food Dyes PDF"
                style={{ marginLeft: 6 }}
              >
                <ExternalLinkIcon />
              </a>
            </List.Item>
            <List.Item>
              FDA color additive status list (official inventory)
              <a
                href="https://www.fda.gov/industry/color-additive-inventories/color-additive-status-list"
                target="_blank"
                rel="noreferrer"
                aria-label="Open FDA color additive status list"
                style={{ marginLeft: 6 }}
              >
                <ExternalLinkIcon />
              </a>
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
