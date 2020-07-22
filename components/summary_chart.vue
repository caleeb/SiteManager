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
      .createLinearGradient(0, 0, 0, 350);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 250);

    this.gradient.addColorStop(0, "rgba(255, 212, 0, 0.3)");
    this.gradient.addColorStop(0.5, "rgba(255, 212, 0, 1.25)");
    this.gradient.addColorStop(1, "rgba(0, 0, 10, .8)");

    this.gradient2.addColorStop(0, "rgba(0, 5, 5, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 12, 50, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 21, 15, 0)");
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: this.siteName,
          borderColor: "#000",
          pointBackgroundColor: "black",
          borderWidth: 1,
          hoverBorderColor: "#fbe631",
          pointBorderColor: "#fbe631",
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
      scaleFontColor: 'red',
      options: {
        scaleFontColor: 'red',
        legend: {
          labels: {
            fontColor: "#fbe631",
            fontSize: 18
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "#fbe631",
                fontSize: 18,
                beginAtZero: true
              },
              gridLines: {
                display: true,
                color: "#fbe631"
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "#fbe631",
                color: "fbe631",
                fontSize: 18
              },
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
<style>

</style>
