import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StackedBarChart } from "./Charts/StackedBarChart";
import { DateSelector } from "./DateSelector";
import { TemporalAggregationSelector } from "./TemporalAggregationSelector";
import { ResetButton } from "./ResetButton";
import { MeasurementUnitSelector } from "./MeasurementUnitSelector";

export const Dashboard = () => {
  return (
    <div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex  items-baseline">
            Consumption in <MeasurementUnitSelector />
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2 ">
          <div className="flex gap-2">
            <DateSelector />
            <TemporalAggregationSelector />
            <ResetButton />
          </div>
          <StackedBarChart />
        </CardContent>
      </Card>
    </div>
  );
};
