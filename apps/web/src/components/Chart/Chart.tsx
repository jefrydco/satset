import { DatasetComponentOption, EChartsOption, SeriesOption } from "echarts";
import React, { useEffect, useRef } from "react";

import * as echarts from "echarts/core";

import {
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

export interface ChartProps {
  dataSource: DatasetComponentOption["source"];
  series: SeriesOption[];
}

const defaultOptions: EChartsOption = {
  backgroundColor: "#121212",
  tooltip: {
    trigger: "axis",
  },
  legend: {},
  xAxis: {
    type: "category",
  },
  yAxis: {},
};

export const Chart: React.FC<ChartProps> = ({ dataSource, series }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts>();

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = echarts.init(chartContainerRef.current, "dark");
      chartRef.current.setOption({
        ...defaultOptions,
        dataset: { source: dataSource },
        series
      });
    }
  }, [dataSource, series]);
  useEffect(() => {
    const resizeCallback = () => {
      chartRef.current?.resize();
    };
    window.addEventListener("resize", resizeCallback);
    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: 400 }} />;
};
