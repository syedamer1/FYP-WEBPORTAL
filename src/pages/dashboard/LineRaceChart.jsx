import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import rawData from "./data.json";

const LineRaceChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const countries = [
      "Wapda Hospital, Faisalabad",
      "Society Hospital , Nabipura Lahore",
      "Zarar Shaheed Trust Hospital",
      "Civil Hospital Sukkur",
      "Shadman General Hospital",
      "Aga Khan University Hospital",
      "Liaquat National Hospital",
      "Saira Memorial Hospital",
    ];
    const datasetWithFilters = [];
    const seriesList = [];

    echarts.util.each(countries, function (country) {
      var datasetId = "dataset_" + country;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: "dataset_raw",
        transform: {
          type: "filter",
          config: {
            and: [
              { dimension: "Year", gte: 1950 },
              { dimension: "Country", "=": country },
            ],
          },
        },
      });
      seriesList.push({
        type: "line",
        datasetId: datasetId,
        showSymbol: false,
        name: country,
        endLabel: {
          show: true,
          formatter: function (params) {
            return params.value[3] + ": " + params.value[0];
          },
        },
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        encode: {
          x: "Year",
          y: "Income",
          label: ["Hospital", "Patients"],
          itemName: "Year",
          tooltip: ["Income"],
        },
      });
    });

    const option = {
      animationDuration: 10000,
      dataset: [
        {
          id: "dataset_raw",
          source: rawData,
        },
        ...datasetWithFilters,
      ],
      title: {
        text: "",
      },
      tooltip: {
        order: "valueDesc",
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        nameLocation: "middle",
      },
      yAxis: {
        name: "Patients",
      },
      grid: {
        right: 140,
      },
      series: seriesList,
    };

    myChart.setOption(option);

    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "73vh",
        overflow: "hidden",
      }}
    />
  );
};

export default LineRaceChart;
