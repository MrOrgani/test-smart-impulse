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
        <CardContent className="flex items-center">
          Consumption in <MeasurementUnitSelector />
          <DateSelector />
          <TemporalAggregationSelector />
          <ResetButton />
        </CardContent>
      </Card>
      <Card className="grid grid-cols-2">
        <Card className="grid grid-cols-2">
          <Card className="flex flex-col">
            <CardTitle className="items-baseline text-xs text-gray-500">
              Amount spent
            </CardTitle>
            <CardContent className="mt-auto">
              <AmountSpentWidget />
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardTitle className="items-baseline text-xs text-gray-500">
              Most expensive category
            </CardTitle>
            <CardContent className="mt-auto">
              <MostExpensiveCategoryWidget />
            </CardContent>
          </Card>
          <Card className="flex flex-col"></Card>
          <Card className="flex flex-col"></Card>
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
