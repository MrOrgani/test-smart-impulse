import React, { useState } from "react";
import { Slider } from "./ui/slider";
import dayjs from "dayjs";

type DoubleSliderProps = {
  range: number[];
};

export const DoubleSlider: React.FC<DoubleSliderProps> = ({ range }) => {
  const [[minValue, maxValue], setRangeValues] = useState(range);

  const handleRangeValuesChange = (values: number[]) => {
    setRangeValues(values);
  };

  console.log("range", range);
  return (
    <Slider
      // step={100}
      minStepsBetweenThumbs={1}
      value={[minValue, maxValue]}
      // value={[minValue, maxValue]}
      onValueChange={handleRangeValuesChange}
      // f={(value) => dayjs(value).format("DD/MM/YYYY")}
    />
  );
};
