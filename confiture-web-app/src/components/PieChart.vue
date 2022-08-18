<script lang="ts" setup>
import Chart, { ChartConfiguration } from "chart.js/auto";
import { onMounted, onUnmounted, ref } from "vue";

import { getCssVarValue } from "../utils";

const props = defineProps<{
  compliant: number;
  notCompliant: number;
  notApplicable: number;
}>();

const chartConfig: ChartConfiguration<"pie", number[], string> = {
  type: "pie",
  data: {
    labels: ["Conforme", "Non conforme", "Non applicable"],
    datasets: [
      {
        data: [props.compliant, props.notCompliant, props.notApplicable],
        backgroundColor: [
          getCssVarValue("--background-action-high-success"),
          getCssVarValue("--background-action-high-error"),
          getCssVarValue("--background-contrast-grey"),
        ],
        borderWidth: 0,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

const canvas = ref<HTMLCanvasElement>();
let chart: Chart;

onMounted(() => {
  chart = new Chart(canvas.value!, chartConfig);
});

onUnmounted(() => {
  chart.destroy();
});

////// Chart color update

const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

function updateChartColors() {
  chart!.data.datasets[0].backgroundColor = [
    getCssVarValue("--background-action-high-success"),
    getCssVarValue("--background-action-high-error"),
    getCssVarValue("--background-contrast-grey"),
  ];
  chart?.update("none");
}

onMounted(() => {
  mediaQueryList.addEventListener("change", updateChartColors);
});

onUnmounted(() => {
  mediaQueryList.removeEventListener("change", updateChartColors);
});
</script>

<template>
  <div class="pie-chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.pie-chart-container {
  max-width: 25rem;
}
</style>
