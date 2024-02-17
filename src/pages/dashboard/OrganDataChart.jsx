import { useEffect, useRef } from "react";
import * as echarts from "echarts";
const OrganDataChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "../../assets/Veins_Medical_Diagram_clip_art.svg"
        );
        const svg = await response.text();
        console.log("SVG Content:", svg);

        echarts.registerMap("organ_diagram", {
          svg: "../../assets/Veins_Medical_Diagram_clip_art.svg",
        });

        const option = {};

        const myChart = echarts.init(chartContainerRef.current);
        myChart.setOption(option);

        myChart.on("mouseover", { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: event.name,
          });
        });

        myChart.on("mouseout", { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
            type: "downplay",
            geoIndex: 0,
            name: event.name,
          });
        });
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default OrganDataChart;
