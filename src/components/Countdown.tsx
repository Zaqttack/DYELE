import { Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getMsUntilChicagoMidnight } from "../lib/date";

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

type CountdownProps = {
  onDayReset?: () => void;
};

const Countdown = ({ onDayReset }: CountdownProps) => {
  const [remaining, setRemaining] = useState(getMsUntilChicagoMidnight());

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextRemaining = getMsUntilChicagoMidnight();
      setRemaining(nextRemaining);
      if (nextRemaining <= 0 && onDayReset) {
        onDayReset();
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [onDayReset]);

  return (
    <Text size="sm" style={{ fontSize: "clamp(12px, 3.2vw, 14px)" }}>
      Next DYELE in{" "}
      <Text span fw={600}>
        {formatCountdown(remaining)}
      </Text>
    </Text>
  );
};

export default Countdown;
