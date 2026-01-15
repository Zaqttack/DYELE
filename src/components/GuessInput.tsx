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
  dateKey: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const GuessInput = ({
  dyes,
  guessedIds,
  dateKey,
  value,
  disabled,
  error,
  onChange,
  onSubmit
}: GuessInputProps) => {
  const hashString = (input: string): number => {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getCategoryHint = (dye?: Dye): string => {
    if (!dye || dye.commonCategories.length === 0) {
      return "";
    }
    const nonMixed = dye.commonCategories.filter((item) => item !== "mixed");
    const pool = nonMixed.length > 0 ? nonMixed : dye.commonCategories;
    const index = hashString(`${dateKey}:${dye.id}`) % pool.length;
    const picked = pool[index];
    if (picked === "mixed") {
      return "found across multiple foods";
    }
    return `found in ${picked}`;
  };

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
              const hint = getCategoryHint(dye);
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
                  {hint ? (
                    <Text size="xs" c="dimmed">
                      {hint}
                    </Text>
                  ) : null}
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
