import { formatDate } from "../formatDate";

import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

describe("formatDate", () => {
  it("should format date with daily aggregation", () => {
    const date = new Date("2022-01-01");
    const formattedDate = formatDate(date, "day");
    expect(formattedDate).toBe("01/01/2022");
  });

  it("should format date with weekly aggregation", () => {
    const date = new Date("2022-01-01");
    const formattedDate = formatDate(date, "week");
    expect(formattedDate).toBe("w1 / 2022");
  });

  it("should format date with monthly aggregation", () => {
    const date = new Date("2022-01-01");
    const formattedDate = formatDate(date, "month");
    expect(formattedDate).toBe("01/2022");
  });

  it("should format date with yearly aggregation", () => {
    const date = new Date("2022-01-01");
    const formattedDate = formatDate(date, "year");
    expect(formattedDate).toBe("2022");
  });

  it("should return an empty string for undefined date", () => {
    const formattedDate = formatDate(undefined, "day");
    expect(formattedDate).toBe("");
  });
});
