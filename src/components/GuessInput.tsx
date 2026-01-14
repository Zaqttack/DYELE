import { Autocomplete, Button, Paper, Stack, Text } from "@mantine/core";
import type { Dye } from "../types";

type GuessInputProps = {
  dyes: Dye[];
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const GuessInput = ({
  dyes,
  value,
  disabled,
  error,
  onChange,
  onSubmit
}: GuessInputProps) => {
  const data = dyes.map((dye) => dye.displayName);

  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      shadow="sm"
      onKeyDown={(event) => {
        if (event.key === "Enter" && !disabled) {
          onSubmit();
        }
      }}
    >
      <Stack gap="sm">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: "0.2em" }}>
          Choose your dye
        </Text>
        <Stack gap="sm">
          <Autocomplete
            placeholder="Start typing a dye name…"
            data={data}
            value={value}
            onChange={(next) => onChange(next ?? "")}
            disabled={disabled}
            nothingFoundMessage="No matching dye"
            clearable
          />
          <Button
            onClick={onSubmit}
            disabled={disabled}
            size="md"
            radius="md"
            color="dark"
          >
            Submit
          </Button>
        </Stack>
        {error ? (
          <Text size="sm" c="red.7" fw={600}>
            {error}
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default GuessInput;
