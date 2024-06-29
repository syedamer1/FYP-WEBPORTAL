import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const BarRaceSymptoms = ({ data }) => {
  const chartRef = useRef(null);
  const initialValues = [
    data.feverCount,
    data.highFeverCount,
    data.hypertensionCount,
    data.cardiacCount,
    data.weaknessPainCount,
    data.respiratoryCount,
    data.cancerCount,
    data.thyroidCount,
    data.prostateCount,
    data.kidneyCount,
    data.neuroCount,
    data.nauseaCount,
    data.asymptomaticCount,
    data.gastrointestinalCount,
    data.orthoCount,
    data.respiratoryCDCount,
    data.cardiacsCDCount,
    data.kidneyCDCount,
  ];
  const chartdata = initialValues.map(() => 0); // Start with zero values
  const stoppedBars = Array(initialValues.length).fill(false); // Tracks which bars have stopped

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      grid: {
        left: "3%", // Adjust the left padding to accommodate yAxis labels
        right: "12%",
        containLabel: true,
      },
      xAxis: {
        max: "dataMax",
      },
      yAxis: {
        type: "category",
        data: [
          "Fever",
          "High Fever",
          "Hypertension",
          "Cardiac Count",
          "Weakness/Pain",
          "Respiratory",
          "Cancer",
          "Thyroid",
          "Prostate",
          "Kidney",
          "Neuro",
          "Nausea",
          "Asymptomatic",
          "Gastrointestinal",
          "Ortho",
          "Respiratory CD",
          "Cardiacs CD",
          "Kidney CD",
        ],
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
      },
      series: [
        {
          realtimeSort: true,
          name: "X",
          type: "bar",
          data: chartdata,
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
      legend: {
        show: true,
      },
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
    };

    function run() {
      const newData = chartdata.map((currentValue, index) => {
        if (!stoppedBars[index]) {
          const newValue = currentValue + Math.round(Math.random() * 200); // Increment value
          if (newValue >= initialValues[index]) {
            stoppedBars[index] = true; // Stop animation for this bar
            return initialValues[index]; // Set to initial value
          }
          return newValue; // Continue animation
        }
        return currentValue; // Bar already stopped, return current value
      });

      chartInstance.setOption({
        series: [
          {
            type: "bar",
            data: newData,
          },
        ],
      });
    }

    chartInstance.setOption(option);
    setTimeout(() => {
      run();
    }, 0);
    const interval = setInterval(() => {
      run();
    }, 3000);

    // Restart animation every 10 minutes
    const restartInterval = setInterval(() => {
      stoppedBars.fill(false); // Reset stoppedBars array
      setTimeout(() => {
        run();
      }, 0);
    }, 600000); // 10 minutes in milliseconds

    return () => {
      clearInterval(interval);
      clearInterval(restartInterval);
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "71vh",
        overflow: "hidden",
      }}
    />
  );
};

BarRaceSymptoms.propTypes = {
  data: PropTypes.object.isRequired,
};

export default BarRaceSymptoms;
