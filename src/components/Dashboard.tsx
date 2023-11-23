import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StackedBarChart } from "./Charts/StackedBarChart";
import { DateSelector } from "./DateSelector";
import { TemporalAggregationSelector } from "./TemporalAggregationSelector";
import { ResetButton } from "./ResetButton";

export const Dashboard = () => {
  return (
    <div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Consommation</CardTitle>
        </CardHeader>
        <CardContent className="pl-2 ">
          <div className="flex">
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
