<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    siteArray: {
      type: Array,
      required: true
    },
    siteName: {
      type: String,
      required: true
    },
    labels: {
      type: Array
    }
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: this.siteName,
          borderColor: "#FC2525",
          pointBackgroundColor: "white",
          borderWidth: 1,
          pointBorderColor: "white",
          backgroundColor: this.gradient,
          data: this.siteArray
        }
      ],
      options: this.options
    });
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }
};
</script>
