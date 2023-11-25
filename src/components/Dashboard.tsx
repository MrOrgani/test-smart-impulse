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

export const Dashboard = () => {
  const [temporalAggregation] = useTemporalAggregation();
  return (
    <div>
      <Card className="">
        <CardContent className="flex items-center p-2">
          Consumption in <MeasurementUnitSelector />
          <DateSelector />
          <TemporalAggregationSelector />
          <ResetButton />
        </CardContent>
      </Card>
      <Card className="grid grid-cols-2">
        <Card className="grid grid-cols-2 grid-rows-2">
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
            <CardContent className="mt-auto p-4">
              <MostExpensiveCategoryWidget />
            </CardContent>
          </Card>
          <Card></Card>
          <Card></Card>
        </Card>
        <Card className="flex flex-col">
          <CardTitle className="items-baseline text-xs text-gray-500">
            Most expensive {temporalAggregation} per category
          </CardTitle>
          <CardContent className="mt-auto">
            <MostExpensiveTemporalAggregationPerCategory />
          </CardContent>
        </Card>
      </Card>
      <Card className="col-span-4">
        <CardContent className=" ">
          <StackedBarChart />
        </CardContent>
      </Card>
    </div>
  );
};
