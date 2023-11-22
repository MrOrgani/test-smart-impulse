import { useEnergyConsumption } from "@/hooks/useEnergyData";
import React from "react";
import { useLocation } from "react-router-dom";
import * as dc from "dc";
import { format, timeFormat, timeParse } from "d3";
import { useDataContext } from "@/context/DataContextProvider";

export const dateFormatSpecifier = "%m/%d/%Y";
export const dateFormat = timeFormat(dateFormatSpecifier);
export const dateFormatParser = timeParse(dateFormatSpecifier);
export const numberFormat = format(".2f");

const ResetButton = (props) => {
  // const style = css({
  //   padding: rhythm(0.1),
  //   display: "inline",
  //   cursor:'pointer',
  //   float:'right',
  //   '&:hover':{
  //       background: "#ddd",
  //   }
  // });
  return (
    <span
      //   {...style}
      onClick={() => {
        props.chart.filterAll();
        dc.redrawAll();
      }}
    >
      reset
    </span>
  );
};

export const ChartTemplate = (props: {
  chartFunction: (arg0: null, arg1: never[]) => any;
  title:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) => {
  /*
    We render the dc chart using an effect. We want to pass the chart as a prop after the dc call,
    but there is nothing by default to trigger a re-render and the prop, by default would be undefined.
    To solve this, we hold a state key and increment it after the effect ran. 
    By passing the key to the parent div, we get a rerender once the chart is defined. 
    */
  const { data } = useDataContext();
  const [chart, updateChart] = React.useState(null);
  const div = React.useRef(null);

  React.useEffect(() => {
    const newChart = props.chartFunction(div.current, data); // chartfunction takes the ref and does something with it

    newChart.render();
    updateChart(newChart);
  }, []);
  {
    /*Run this exactly once */
  }

  //   const chartStyles = css({
  //     width: "100%",
  //     height: "auto",
  //     boxSizing: "border-box",
  //     padding: rhythm(1),
  //     "& label": {
  //       textTransform: "capitalize",
  //       textDecoration: "underline",
  //     },
  //   });
  return (
    <div ref={div} className="w-full h-auto">
      <ResetButton chart={chart} />
      <label>{props.title}</label>
    </div>
  );
};
