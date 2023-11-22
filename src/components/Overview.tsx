import { RawData, transposeData } from "@/lib/utils";
import React, { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const data: RawData[] = [
//   {
//     label: "Energie totale",
//     data: [
//       [1435701600000, 3897180.2],
//       [1435788000000, 4187444.3],
//       [1435874400000, 4024570.4],
//     ],
//   },
//   {
//     label: "Autres CVC",
//     data: [
//       [1435701600000, 1063169.5],
//       [1435788000000, 1076251.8],
//       [1435874400000, 1027960.6],
//     ],
//   },
//   {
//     label: "Production chaud/froid",
//     data: [
//       [1435701600000, 1026017.6],
//       [1435788000000, 1254589.2],
//       [1435874400000, 1188516.8],
//     ],
//   },
//   {
//     label: "Ventilation (CTA)",
//     data: [
//       [1435701600000, 920444.8],
//       [1435788000000, 916323.9],
//       [1435874400000, 916425.6],
//     ],
//   },
//   {
//     label: "Informatique",
//     data: [
//       [1435701600000, 341019.6],
//       [1435788000000, 355009.7],
//       [1435874400000, 334875.3],
//     ],
//   },
//   {
//     label: "Autres \u00e9clairages",
//     data: [
//       [1435701600000, 61070.4],
//       [1435788000000, 74046.2],
//       [1435874400000, 59444.1],
//     ],
//   },
//   {
//     label: "\u00c9clairage sur ballast \u00e9lectronique",
//     data: [
//       [1435701600000, 327726.9],
//       [1435788000000, 335153.7],
//       [1435874400000, 167825.4],
//     ],
//   },
//   {
//     label: "Lampes fluocompactes",
//     data: [
//       [1435701600000, 157731.4],
//       [1435788000000, 176069.8],
//       [1435874400000, 167825.4],
//     ],
//   },
// ];

export const Overview = ({ data }: { data: RawData[] }) => {
  const transposedData = useMemo(() => transposeData(data), [data]);
  return (
    <div className="overflow-x-scroll">
      <BarChart
        width={transposedData.length * 10}
        height={500}
        data={transposedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}

        <Bar dataKey={"Energie totale"} stackId="a" fill="#42374D" />
        <Bar dataKey="Autres CVC" stackId="a" fill="#BCBDDC" />
        <Bar dataKey="Production chaud/froid" stackId="a" fill="#BC80BD" />
        <Bar dataKey="Ventilation (CTA)" stackId="a" fill="#80B1D3" />
        <Bar dataKey="Informatique" stackId="a" fill="#B2DF8A" />
        <Bar dataKey={"Autres \u00e9clairages"} stackId="a" fill="#F46D43" />
        <Bar
          dataKey={"\u00c9clairage sur ballast \u00e9lectronique"}
          stackId="a"
          fill="#FDAE61"
        />
        <Bar dataKey="Lampes fluocompactes" stackId="a" fill="#E9D78E" />
      </BarChart>
    </div>
  );
};
