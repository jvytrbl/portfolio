import { describe, expect, it } from "vitest";
import { formatDate, formatPeriod, formatYearMonth } from "@/lib/format";

describe("format", () => {
  it("formats ISO dates as month + year in UTC", () => {
    expect(formatDate("2026-09-01T00:00:00.000Z")).toBe("Sep 2026");
    // Would roll back to Dec 2025 in a negative-offset local time zone.
    expect(formatDate("2026-01-01T00:00:00.000Z")).toBe("Jan 2026");
  });

  it("formats YYYY-MM values", () => {
    expect(formatYearMonth("2024-03")).toBe("Mar 2024");
  });

  it("formats open and closed periods", () => {
    expect(formatPeriod("2022-06", "2024-02")).toBe("Jun 2022 – Feb 2024");
    expect(formatPeriod("2024-03")).toBe("Mar 2024 – Present");
  });
});
