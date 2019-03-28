<template>
  <v-container fluid>
    <v-layout row align-center justify-center class="reduce">
      <v-flex md6>
        <div class="Chart__list">
          <div class="Chart">
            <h2 class="body-2 text-xs-center">SiteReport</h2>
            <LineChart v-if="loaded" :siteArray="siteArray" :siteName="siteName" :labels="labels"></LineChart>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LineChart from "@/components/chart_component";
import moment from "moment";
export default {
  layout: "site_manager_layout",
  components: {
    LineChart
  },
  asyncData({ params }) {
    return {
      siteId: params.id,
      siteArray: [],
      siteName: "",
      labels: [],
      loaded: false
    };
  },
  async mounted() {
    let { data } = await this.$axios.post("site_status/" + this.siteId);
    this.loaded = true;
    this.calcTimeElapsed(data);
  },
  methods: {
    calcTimeElapsed(AllStats) {
      AllStats.forEach(element => {
        this.labels.push(element.status);
        this.siteArray.push(
          Math.abs(
            moment
              .duration(
                moment(element.dateVal).diff(
                  this.getComaprisonDate(element.status, AllStats)
                )
              )
              .asHours()
          )
        );
      });
      console.log(this.siteArray);
    },
    getComaprisonDate(status, Allstats) {
      let filtered_array = Allstats.filter(sites => {
        return sites.status === this.getNextStatus(status);
      });
      if (filtered_array.length > 0) {
        return moment(filtered_array[0].dateVal);
      } else {
        return moment(new Date());
      }
    },
    getNextStatus(siteStatus) {
      switch (siteStatus) {
        case "Site Identified":
          return "Site Survey Requested";
          break;
        case "Site Survey Requested":
          return "Site Survey Completed";
          break;
        case "Site Survey Completed":
          return "Site Payment Made";
          break;
        case "Site Payment Made":
          return "Ethio Telecom Provision";
          break;
        case "Ethio Telecom Provision":
          return "Site Configuration";
          break;
        case "Site Activated":
          return "";
          break;
        default:
          return "";
          break;
      }
    }
  }
};
</script>
<style scoped>
.Chart {
  background: #212733;
  border-radius: 15px;
  box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
}

.Chart h2 {
  margin-top: 0;
  padding: 15px 0;
  color: white;
  border-bottom: 1px solid #323d54;
}

</style>

