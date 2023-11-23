import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StackedBarChart } from "./Charts/StackedBarChart";

export const Dashboard = () => {
  return (
    <div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Consommation</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <StackedBarChart />
        </CardContent>
      </Card>
    </div>
  );
};
