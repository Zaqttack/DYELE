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

const Countdown = () => {
  const [remaining, setRemaining] = useState(getMsUntilChicagoMidnight());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getMsUntilChicagoMidnight());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink">
      Next puzzle in <span className="font-semibold">{formatCountdown(remaining)}</span>
    </div>
  );
};

export default Countdown;
