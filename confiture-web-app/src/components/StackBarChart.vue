<script lang="ts" setup>
import Chart, { ChartConfiguration } from "chart.js/auto";
import { ref } from "vue";

import { onMounted } from "vue";
import { getCssVarValue } from "../utils";

interface DataItem {
  name: string;
  compliant: number;
  notCompliant: number;
  notApplicable: number;
}

const props = defineProps<{
  data: DataItem[];
}>();

const percentagaData = props.data.map((item) => {
  const r = {
    name: item.name,
    compliant:
      item.compliant /
      (item.compliant + item.notApplicable + item.notCompliant),
    notCompliant:
      item.notCompliant /
      (item.compliant + item.notApplicable + item.notCompliant),
    notApplicable:
      item.notApplicable /
      (item.compliant + item.notApplicable + item.notCompliant),
  };

  return r;
});

const chartLabels = props.data.map((item) => item.name);
const chartDatasets = [
  {
    label: "Conforme",
    data: percentagaData.map((item) => item.compliant),
    backgroundColor: getCssVarValue("--background-action-high-success"),
    barThickness: 16,
  },
  {
    label: "Non conforme",
    data: percentagaData.map((item) => item.notCompliant),
    backgroundColor: getCssVarValue("--background-action-high-error"),
    barThickness: 16,
  },
  {
    label: "Non applicable",
    data: percentagaData.map((item) => item.notApplicable),
    backgroundColor: getCssVarValue("--background-contrast-grey"),
    barThickness: 16,
  },
];

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  new Chart(canvas.value!, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: chartDatasets,
    },

    options: {
      // maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const data = props.data.find(
                (item) => item.name === context.label
              );

              const key = ["compliant", "notCompliant", "notApplicable"][
                context.datasetIndex
              ] as keyof DataItem;

              return `${context.dataset.label} : ${data![key]}`;
            },
          },
        },
      },
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          display: false,
          grid: {
            drawBorder: false,
            display: false,
          },
          stacked: true,
          ticks: {
            color: getCssVarValue("--text-mention-grey"),
            font: {
              weight: "bold",
              family: "Marianne",
            },
          },
        },
        y: {
          stacked: true,
          grid: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            color: getCssVarValue("--text-mention-grey"),
            font: {
              weight: "500",
              family: "Marianne",
            },
          },
        },
      },
    },
  });
});
</script>

<template>
  <canvas ref="canvas" />
</template>

<style scoped>
/* .stack-bar-chart-container {
  max-width: 100%;
  display: flex;
} */
/* 
.stack-bar-chart-container > div {
  flex: 1;
}
.stack-bar-chart-container > div > canvas {
  max-width: 100%;
} */
</style>
