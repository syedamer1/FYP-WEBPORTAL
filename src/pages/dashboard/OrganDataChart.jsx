import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import VeinsMedicalSVG from "@assets/images/users/Veins_Medical_Diagram_clip_art.svg";
const OrganDataChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const initializeChart = async () => {
      const chartInstance = echarts.init(chartContainerRef.current, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });

      let option;

      const svg = { VeinsMedicalSVG }; // Use the imported SVG directly

      if (svg) {
        echarts.registerMap("organ_diagram", { svg: svg });
        option = {
          tooltip: {},
          geo: {
            left: 10,
            right: "50%",
            map: "organ_diagram",
            selectedMode: "multiple",
            emphasis: {
              focus: "self",
              itemStyle: {
                color: null,
              },
              label: {
                position: "bottom",
                distance: 0,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },
            blur: {},
            select: {
              itemStyle: {
                color: "#b50205",
              },
              label: {
                show: false,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },
          },
          grid: {
            left: "60%",
            top: "20%",
            bottom: "20%",
          },
          xAxis: {},
          yAxis: {
            data: [
              "heart",
              "large-intestine",
              "small-intestine",
              "spleen",
              "kidney",
              "lung",
              "liver",
            ],
          },
          series: [
            {
              type: "bar",
              emphasis: {
                focus: "self",
              },
              data: [121, 321, 141, 52, 198, 289, 139],
            },
          ],
        };
        chartInstance.setOption(option);
        chartInstance.on("mouseover", { seriesIndex: 0 }, function (event) {
          chartInstance.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: event.name,
          });
        });
        chartInstance.on("mouseout", { seriesIndex: 0 }, function (event) {
          chartInstance.dispatchAction({
            type: "downplay",
            geoIndex: 0,
            name: event.name,
          });
        });
      }

      window.addEventListener("resize", chartInstance.resize);

      return () => {
        window.removeEventListener("resize", chartInstance.resize);
        chartInstance.dispose();
      };
    };

    initializeChart();
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default OrganDataChart;
