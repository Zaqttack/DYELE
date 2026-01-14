import {
  Autocomplete,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text
} from "@mantine/core";
import type { Dye } from "../types";

type GuessInputProps = {
  dyes: Dye[];
  guessedIds: string[];
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const GuessInput = ({
  dyes,
  guessedIds,
  value,
  disabled,
  error,
  onChange,
  onSubmit
}: GuessInputProps) => {
  const data = dyes
    .filter((dye) => !guessedIds.includes(dye.id))
    .map((dye) => ({ value: dye.displayName }));
  const selectedDye = dyes.find((dye) => dye.displayName === value);

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
            leftSection={
              <Box
                w={16}
                h={16}
                style={{
                  borderRadius: 6,
                  border: "1px solid rgba(18, 17, 23, 0.15)",
                  backgroundColor: selectedDye?.colorHex ?? "#d0d0d4"
                }}
              />
            }
            renderOption={({ option }) => {
              const dye = dyes.find((item) => item.displayName === option.value);
              return (
                <Group gap="sm" align="center">
                  <Box
                    w={18}
                    h={18}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(18, 17, 23, 0.15)",
                      backgroundColor: dye?.colorHex ?? "#d0d0d4"
                    }}
                  />
                  <Text size="sm" fw={600}>
                    {option.value}
                  </Text>
                </Group>
              );
            }}
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
