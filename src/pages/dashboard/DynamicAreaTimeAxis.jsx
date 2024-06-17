import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const DynamicAreaTimeAxis = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = document.getElementById("dynamicAreaTimeAxis");
    chartRef.current = echarts.init(chartDom);

    let base = +new Date(1988, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let data = [[base, Math.random() * 300]];
    for (let i = 1; i < 20000; i++) {
      let now = new Date((base += oneDay));
      data.push([
        +now,
        Math.round((Math.random() - 0.5) * 20 + data[i - 1][1]),
      ]);
    }

    const option = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "center",
        text: "",
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 20,
        },
        {
          start: 0,
          end: 20,
        },
      ],
      series: [
        {
          name: "Patient Count",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: data,
        },
      ],
    };

    chartRef.current.setOption(option);

    const handleResize = () => {
      chartRef.current.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="dynamicAreaTimeAxis"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
};

export default DynamicAreaTimeAxis;
