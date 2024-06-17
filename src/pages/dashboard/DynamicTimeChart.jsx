import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const DynamicTimeChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: "Dynamic Data & Time Axis",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          params = params[0];
          var date = new Date(params.name);

          var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return (
            date.getDate() +
            "-" +
            monthNames[date.getMonth()] +
            "-" +
            date.getFullYear() +
            " | Patient : " +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: "Provided Data",
          type: "line",
          showSymbol: false,
          data: chartData.map(([name, value]) => ({
            name,
            value: [name, value],
          })),
        },
      ],
    };

    myChart.setOption(option);

    window.addEventListener("resize", () => {
      myChart.resize();
    });

    return () => {
      window.removeEventListener("resize", myChart.resize);
      myChart.dispose();
    };
  }, [chartData]);

  return (
    <div
      id="main"
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "70vh",
        overflow: "hidden",
      }}
    />
  );
};

DynamicTimeChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ).isRequired,
};

export default DynamicTimeChart;
