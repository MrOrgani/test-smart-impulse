import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { StackedBarChart } from "./Charts/StackedBarChart/StackedBarChart";
import { DateSelector } from "./DateSelector";
import { TemporalAggregationSelector } from "./TemporalAggregationSelector";
import { ResetButton } from "./ResetButton";
import { MeasurementUnitSelector } from "./MeasurementUnitSelector";
import { AmountSpentWidget } from "./Widgets/AmountSpentWidget";
import { MostExpensiveCategoryWidget } from "./Widgets/MostExpensiveCategoryWidget";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { MostExpensiveTemporalAggregationPerCategory } from "./Widgets/MostExpensiveTemporalAggregationPerCategory";

export const Dashboard: React.FC = () => {
  const [temporalAggregation] = useTemporalAggregation();
  return (
    <div className="">
      <div className="flex flex-col items-center gap-2 lg:flex-row my-2">
        <div className="flex">
          Consumption in <MeasurementUnitSelector />
        </div>
        <DateSelector />
        <TemporalAggregationSelector />
        <ResetButton />
      </div>
      <div className="flex flex-col lg:grid lg:ggrid-cols-2">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2">
          <Card className="flex flex-col">
            <CardTitle className="items-baseline text-xs text-gray-500">
              Amount spent
            </CardTitle>
            <CardContent className=" p-4">
              <AmountSpentWidget />
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardTitle className="items-baseline text-xs text-gray-500">
              Most expensive category
            </CardTitle>
            <CardContent className=" p-4">
              <MostExpensiveCategoryWidget />
            </CardContent>
          </Card>
          <Card></Card>
          <Card></Card>
        </div>
        <Card className="flex flex-col p-2">
          <CardTitle className="items-baseline text-xs text-gray-500">
            Most expensive {temporalAggregation} per category
          </CardTitle>
          <MostExpensiveTemporalAggregationPerCategory />
        </Card>
      </div>
      <div className={" overflow-scroll"}>
        <StackedBarChart />
      </div>
    </div>
  );
};
