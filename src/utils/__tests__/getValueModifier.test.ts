import { getValueModifier } from "../getValueModifier";

describe("getValueModifier", () => {
  it("should return a function that divides the value by 1,000,000 when measureUnit is 'MWh'", () => {
    const modifier = getValueModifier("MWh");
    expect(modifier(1000000)).toBe(1);
    expect(modifier(5000000)).toBe(5);
  });

  it("should return a function that divides the value by 1,000 when measureUnit is 'kWh'", () => {
    const modifier = getValueModifier("kWh");
    expect(modifier(1000)).toBe(1);
    expect(modifier(5000)).toBe(5);
  });

  it("should return a function that multiplies the value by MWhPrice divided by 1,000,000 when measureUnit is 'euros'", () => {
    const modifier = getValueModifier("euros");
    expect(modifier(1000000, 83)).toBe(83);
    expect(modifier(5000000, 83)).toBe(415);
  });
});
