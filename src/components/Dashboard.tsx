import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StackedBarChartJS } from "./Charts/StackedBarChartJS";

export const Dashboard = () => {
  return (
    <div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Consommation</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {/* <Overview data={data} /> */}
          {/* <StackedBarChart /> */}
          <StackedBarChartJS />
        </CardContent>
      </Card>
    </div>
  );
};
