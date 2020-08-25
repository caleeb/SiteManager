<template>
  <v-layout row wrap>
    <!-- <v-card class="whole-card"> -->

    <v-flex align-start>
      <v-subheader class="">
        <span
          style="font-size: 25px; font-family: Ubuntu !important; font-weight: 1000 !important;"
        >
          Overall Sites Summary
        </span>
      </v-subheader>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card
            height="180"
            class="mr-1 mt-2"
            flat
            style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
          >
            <v-card-title primary-title class="cent">
              <h2 style=" font-family: Ubuntu !important; color: #fbe631;">
                Sites
              </h2>
              <h1
                mt-2
                class="headline nash-2"
                style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu !important;
                      color: #fbe631 !important;
                     "
              >
                {{ overall.count }}
              </h1>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card
            height="180"
            max-width="100%"
            class="mr-1 mt-2"
            flat
            style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
          >
            <v-card-title primary-title class="cent">
              <h2 style="color: #fbe631;  font-family: Ubuntu !important;">
                Potential Customers
              </h2>
              <h1
                mt-1
                class="headline nash-2"
                style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu !important;
                      color: #fbe631 !important;
                     "
              >
                {{ overall.Customers }}
              </h1>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card
            height="180"
            max-width="100%"
            class="mr-1 mt-2"
            flat
            style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
          >
            <v-card-title primary-title class="cent">
              <h2
                style="color: #fbe631;  font-family: Ubuntu, Roboto, sans-serif !important;"
              >
                % of Business Units
              </h2>
              <h1
                mt-1
                class="headline nash-2"
                style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu, Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
              >
                {{ Number(overall.Business).toPrecision(4) + "%" }}
              </h1>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-flex mt-4 md12>
          <v-subheader
            style="background-color: black; color: #fbe631 !important; 
            font-size: 24px !important; 
            font-family: Ubuntu, Roboto, sans-serif; font-weight: 1000 !important"
            class="mt-1 mb-2"
            >Overall Summary of Sites - Divided By Statuses (i.e. Site
            Identified, Civil Work Complete,...)</v-subheader
          >
          <v-data-table
            :headers="headers2"
            dark
            :items="byStatusOf"
            light
            class="elevation-11"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.status }}</td>
                <td>
                  {{ props.item.count }}
                </td>

                <td>
                  <v-chip :color="getColor(props.item.Customers)" dark>{{
                    props.item.Customers
                  }}</v-chip>
                </td>
                <td>{{ Number(props.item.Business).toPrecision(4) + "%" }}</td>
                <td>{{ Number(props.item.Occupancy).toPrecision(4) }}</td>
                <td>{{ props.item.Blocks }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-flex>
    <!-- <v-flex align-start>
      <v-subheader class="">
        <span
          style="font-size: 25px; font-family: Ubuntu !important; font-weight: 1000 !important;"
        >
          Identified Sites - This Week
        </span>
      </v-subheader>
      <v-layout row wrap justify-center>
        <v-flex md3 v-for="(item, i) in week" :key="i">
          <v-card
            height="150"
            flat
            style="border-radius: 0px; background-color: rgb(47, 25, 25) !important"
            class="mr-1 mt-2 white--text"
          >
            <v-layout row>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div
                      class="one-line"
                      style=" 
                      margin-top: 4px;
                      font-weight: 1000 !important;
                      font-size: 20px !important;
                      font-family: Ubuntu !important;
                      color: #FFFFFF !important;
                     "
                    >
                      {{ item.name }}
                    </div>
                    <div
                      style=" 
                      margin-top: 1px;
                      font-size: 15px !important;
                      font-family: Ubuntu !important;
                      color: #FFF !important;
                     "
                    >
                      {{ item.location }}
                    </div>
                 
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs5>
                <v-img
                  :src="
                    item.files != null
                      ? baseFILEURL + item.files[0].filename
                      : baseFILEURL + 'ws.png'
                  "
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    -->
    <v-flex align-start mt-2>
      <v-subheader class="">
        <span
          style="font-size: 25px; 
          font-family: Ubuntu !important; font-weight: 1000 !important;"
        >
          Summary of The Last 7 Days
        </span>
      </v-subheader>
      <v-layout row wrap mb-4 mt-2>
        <v-flex style="color: #fbe631 !important">
          <v-subheader
            style="background-color: black; color: #fbe631 !important; 
            font-size: 24px !important; 
            font-family: Ubuntu, Roboto, sans-serif; font-weight: 1000 !important"
            class="mt-1 mb-2"
            >Last 7 Days Summary - By Site Type (i.e. Condominium, Apartment
            Building,...)</v-subheader
          >
          <v-data-table
            :headers="headers"
            dark
            :items="thisWe"
            light
            class="elevation-11"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.site_type }}</td>
                <td>
                  {{ props.item.count }}
                </td>

                <td>
                  <v-chip :color="getColor(props.item.Customers)" dark>{{
                    props.item.Customers
                  }}</v-chip>
                </td>
                <td>{{ Number(props.item.Business).toPrecision(4) + "%" }}</td>
                <td>{{ Number(props.item.Occupancy).toPrecision(4) + "%" }}</td>
                <td>{{ props.item.Blocks }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
      <v-layout row wrap mt-4>
        <v-flex md4>
          <v-layout row wrap>
            <v-flex md12>
              <v-card
                height="151"
                class="mr-1"
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Identified Sites
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ siteArray[3] }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md12>
              <v-card
                height="151"
                class="mr-1 mt-1"
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Total No. of Customers
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ ident.Customers }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md12>
              <v-card
                height="151"
                class="mr-1 mt-1"
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Business Units
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ Number(ident.Business).toPrecision(4) + "%" }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex md4>
          <v-card
            dark
            height="100%"
            class="mr-1 elevation-20"
            style="border-radius : 20px !important;"
          >
            <v-toolbar height="40" color="#fbe631" dark>
              <v-toolbar-title
                style="color: black; font-size: 15px; font-family: Ubuntu,Roboto, sans-serif !important; font-weight: 1000 !important;"
                >Identified Sites - Last 7 Days</v-toolbar-title
              >

              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon color="black" to="/">link</v-icon>
              </v-btn>
            </v-toolbar>

            <v-list two-line>
              <template v-for="(item, index) in week.slice(0, 4)">
                <v-list-tile avatar tile dark :key="index">
                  <v-list-tile-avatar>
                    <img
                      :src="
                        item.files != null
                          ? baseFILEURL + item.files[0].filename
                          : baseFILEURL + 'ws.png'
                      "
                    />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title
                      class="lnash"
                      v-html="item.name"
                    ></v-list-tile-title>
                    <v-list-tile-sub-title
                      class="xlnash"
                      v-html="item.location"
                    ></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <v-card-actions class="justify-start">
              <div class="text-xs-center">
                <v-btn to="/" round color="#fbe631">
                  <span class="black--text">Go to Sites</span>
                  <v-icon right color="black">cloud_upload</v-icon>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card height="100%" style="border-radius : 20px !important;">
            <v-toolbar height="40" color="#fbe631" dark>
              <v-toolbar-title
                style="color: black; font-size: 15px; font-family: Ubuntu,Roboto, sans-serif !important; font-weight: 1000 !important;"
              >
                Site Identification Projections - [Over The Last 30
                Days]</v-toolbar-title
              >

              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon color="black" to="/">link</v-icon>
              </v-btn>
            </v-toolbar>
            <div class="Chart__list">
              <div class="Chart">
                <LineC
                  v-if="loaded"
                  :siteArray="siteArray"
                  :labels="labels"
                  :siteName="'This Month'"
                ></LineC>
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- </v-container> -->
    </v-flex>
    <hr class="mt-2 mb-2" style="border-color: #fbe631 !important;" />
    <v-flex align-start mt-2>
      <v-subheader class="">
        <span
          style="font-size: 25px; 
          font-family: Ubuntu,Roboto, sans-serif !important; font-weight: 1000 !important;"
        >
          Overall Summary based on Status
        </span>
      </v-subheader>
      <v-layout justify-center row wrap>
        <v-flex md4>
          <v-select
            :items="selects"
            label="Filter Sites"
            v-model="selectedCat"
          ></v-select>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, index) in filteredItems">
          <v-layout row wrap :key="index">
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Status Name
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 34px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ item.status }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    No. of Potential Customers
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ item.Customers }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Total No. of Blocks
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ item.Blocks }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Avg. Percentage of Business Units
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ Number(item.Business).toPrecision(4) + " %" }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Avg. Occupancy Rate
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ Number(item.Occupancy).toPrecision(4) + " %" }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex md4>
              <v-card
                height="180"
                class="mr-1 mt-2"
                flat
                style="border-radius: 20px; background-color: rgb(53, 52, 62) !important;"
              >
                <v-card-title primary-title class="cent">
                  <h2
                    style=" font-family: Ubuntu,Roboto, sans-serif !important; color: #fbe631;"
                  >
                    Total Number of Sites
                  </h2>
                  <h1
                    mt-2
                    class="headline nash-2"
                    style=" 
                      margin-top: 8px;
                      font-size: 54px !important;
                      font-family: Ubuntu,Roboto, sans-serif !important;
                      color: #fbe631 !important;
                     "
                  >
                    {{ item.count }}
                  </h1>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
          <!-- <v-layout mt-2 row wrap :key="index + 1">
            <v-flex md4> </v-flex>
            <v-flex md6>
              <v-card height="100%" style="border-radius : 20px !important;">
                <v-toolbar height="40" color="#fbe631" dark>
                  <v-toolbar-title
                    style="color: black; font-size: 15px; font-family: Ubuntu !important; font-weight: 1000 !important;"
                  >
                    Site Identification Projections - [Overall]</v-toolbar-title
                  >

                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon color="black" to="/">link</v-icon>
                  </v-btn>
                </v-toolbar>
                <div class="Chart__list">
                  <div class="Chart">
                    <LineC
                      v-if="loaded"
                      :siteArray="by_status"
                      :labels="by_label"
                      :siteName="'Overall'"
                    ></LineC>
                  </div>
                </div>
              </v-card>
            </v-flex>
          </v-layout> -->
        </template>
      </v-layout>
      <v-divider></v-divider>
      <hr class="mt-4" style="border-color: #fbe631 !important;" />

      <hr class="mt-4 mb-2" style="border-color: #fbe631 !important;" />
    </v-flex>

    <!-- </v-card> -->
    <!-- </v-flex> -->
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import LineChart from "@/components/spark.vue";
import LineC from "@/components/summary_chart.vue";

export default {
  // name: "LineChartContainer",
  layout: "site_manager_layout",
  middleware: "authenticated",
  components: {
    LineChart,
    LineC
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser", "userGroups"]),
    filteredItems() {
      return this.report_data.filter(data => data.status === this.selectedCat);
    }
  },

  async asyncData({ app, _, __ }) {
    let { data } = await app.$axios.post("report");
    let x = await app.$axios.post("overall");
    let y = await app.$axios.post("week");
    let z = await app.$axios.post("countweek");
    let r = await app.$axios.post("this_week");
    let s = await app.$axios.post("overall2");
    let t = await app.$axios.post("this_week2");

    console.log(t.data);
    let arr = z.data;
    let array = [];
    let identified = r.data;
    let overall2 = s.data;
    let stats = [];
    let oves2 = [];
    for (var i = 0; i < arr.length; i++) {
      array.push(arr[i]);
    }

    let values = Object.keys(data[0]).map(function(key) {
      return data[0][key];
    });
    let byStat = [];
    // console.log(values);
    for (var i = 1; i < values.length; i++) {
      byStat.push(values[i]);
    }

    // console.log(this.selectedCat);

    data.forEach(function(x) {
      stats.push(x.status);
    });

    // this.selects = stats;

    array = array.reverse();
    // console.log(byStat);
    return {
      // options: {
      //   responsive: true,
      //   maintainAspectRatio: false
      // },

      baseFILEURL: "https://vispsites.websprix.com/",
      labels: ["4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "A Week Ago"],
      loaded: true,
      siteArray: array,
      report_data: data,
      overall: x.data[0],
      ident: identified[0],
      week: y.data,
      by_status: byStat,
      byStatusOf: overall2,
      selects: stats,
      thisWe: t.data,
      headers: [
        {
          text: "Site Type",
          align: "left",
          value: "status"
        },
        { text: "Site Count", value: "count" },
        { text: "Potential Customers", value: "Customers" },
        { text: "% of Business Units", value: "Business" },
        { text: "Occupancy Rate", value: "Occupancy" },
        { text: "Total No. of Blocks", value: "Blocks" }
      ],
      headers2: [
        {
          text: "Site Status",
          align: "left",
          value: "status"
        },
        { text: "Site Count", value: "count" },
        { text: "Potential Customers", value: "Customers" },
        { text: "% of Business Units", value: "Business" },
        { text: "Occupancy Rate", value: "Occupancy" },
        { text: "Total No. of Blocks", value: "Blocks" }
      ],
      by_label: [
        "Site Count",
        "No. of Potential Customers",
        "No. of Blocks",
        "% of Business Units",
        "Occupancy Rate"
      ],
      selectedCat: "Site Identified"
    };
  },
  mounted() {
    // this.renderChart(this.report_data[0], this.options);
  },
  methods: {
    getColor(cust) {
      if (cust <= 500) return "red";
      else if (cust > 500 && cust < 1500) return "orange";
      else return "green";
    }
  }
};
</script>
<style scoped>
.nash {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  font-size: 20px !important;
  color: #fff !important;
}
.nash2 {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  font-size: 12px !important;
}
.whole-card {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  background-color: #ffffff !important;
}
.lnash {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  font-size: 15px !important;
  color: #fbe631 !important;
  font-weight: 1000;
}
.xlnash {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  font-size: 12px !important;
  color: #fbe631 !important;
}
.cent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.v-text-field--box > .v-input__control > .v-input__slot,
.v-text-field--full-width > .v-input__control > .v-input__slot,
.v-text-field--outline > .v-input__control > .v-input__slot {
  align-items: stretch;
  min-height: 25px !important;
}
.one-line {
  overflow: hidden;
  text-overflow: ellipsis;
}
.Chart {
  background: #f7f7f7;
  border-radius: 15px;
  box-shadow: 0px 2px 15px rgba(2, 5, 25, 0.27);
  height: 100% !important;
}
table.blueTable {
  border: 1px solid #fbe631;
  background-color: #eeeeee;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}
table.blueTable td,
table.blueTable th {
  border: 1px solid #aaaaaa;
  padding: 3px 2px;
}
table.blueTable tbody td {
  font-size: 13px;
}
table.blueTable tr:nth-child(even) {
  background: #d0e4f5;
}
table.blueTable thead {
  background: #fbe631;
  background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1c6ea4 100%);
  background: -webkit-linear-gradient(
    top,
    #5592bb 0%,
    #327cad 66%,
    #1c6ea4 100%
  );
  background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1c6ea4 100%);
  border-bottom: 2px solid #444444;
}
table.blueTable thead th {
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border-left: 2px solid #d0e4f5;
}
table.blueTable thead th:first-child {
  border-left: none;
}
table.v-table tbody tr {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  color: #fbe631 !important;
  font-size: 15px !important;
  font-weight: 1000 !important;
}
table.v-table thead th {
  font-family: Ubuntu, "Roboto", sans-serif !important;
  color: #fbe631 !important;
  font-size: 17px !important;
  font-weight: 1000 !important;
}

table.v-table tbody td {
  font-weight: 1000 !important;
  font-size: 15px !important;
}
table.blueTable tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: #d0e4f5;
  background: -moz-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #d0e4f5 100%);
  background: -webkit-linear-gradient(
    top,
    #dcebf7 0%,
    #d4e6f6 66%,
    #d0e4f5 100%
  );
  background: linear-gradient(to bottom, #dcebf7 0%, #d4e6f6 66%, #d0e4f5 100%);
  border-top: 2px solid #444444;
}
table.blueTable tfoot td {
  font-size: 14px;
}
table.blueTable tfoot .links {
  text-align: right;
}
table.blueTable tfoot .links a {
  display: inline-block;
  background: #1c6ea4;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>
