<template>
  <v-layout row wrap>
    <!-- <v-card class="whole-card"> -->
    <v-flex>
      <v-subheader class="">
        <span
          style="font-size: 25px; font-family: Ubuntu !important; font-weight: 1000 !important;"
        >
          Identified Sites - This Week
        </span>
      </v-subheader>
      <v-layout row wrap justify-center>
        <v-flex mr-1 md4 v-for="(item, i) in week" :key="i">
          <v-card
            height="180"
            style="border-radius: 20px; background-color: rgb(132, 0, 0) !important"
            class="mt-2 white--text"
          >
            <v-layout row>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div
                      class="headline"
                      style=" 
                      margin-top: 8px;
                      font-weight: 1000 !important;
                      font-size: 26px !important;
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
                    <div
                      style=" 
                      display: flex;
                      align-items: center;
                      margin-top: 1px;
                      font-size: 16px !important;
                      font-family: Ubuntu !important;
                      color: #FFF !important;
                     "
                    >
                      <v-btn small dark outline round>Site Type</v-btn>
                      <span>
                        {{ " - " + item.site_type }}
                      </span>
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
                <h2 style="color: #fbe631;  font-family: Ubuntu !important;">
                  % of Business Units
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
                  {{ overall.Business + "%" }}
                </h1>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex align-start>
        <v-subheader class="">
          <span
            style="font-size: 25px; font-family: Ubuntu !important; font-weight: 1000 !important;"
          >
            Summary based on Status
          </span>
        </v-subheader>
        <v-layout row wrap align-space-between>
          <template v-for="(item, index) in report_data">
            <v-flex :key="index" md4>
              <v-card
                class="px-2 elevation-5 mr-2 mt-2"
                flat
                style="border-radius: 20px; background-color: #fff"
              >
                <v-toolbar flat height="30px" dark>
                  <v-toolbar-title class="nash black--text">{{
                    item.status
                  }}</v-toolbar-title>
                </v-toolbar>
                <v-layout row wrap>
                  <v-flex mr-2 xs6 md3 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="color: #fbe631;font-weight: 1000 !important;"
                    >
                      Total No. of Potential Customers 
                    </span>
                    <!-- <v-subheader>{{item.status}}</v-subheader> -->
                  </v-flex>
                  <v-flex xs12 md7 mt-2 mb-2>
                    <v-text-field
                      style="min-height: 35px !important; "
                      single-line
                      solo
                      dark
                      disabled
                      :value="item.Customers"
                    ></v-text-field
                  ></v-flex>
                  <v-flex mr-2 xs6 md3 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Total No. of Blocks 
                    </span>
                  </v-flex>
                  <v-flex xs12 md7 mt-1 mb-1>
                    <v-text-field
                      style="min-height: 35px !important; "
                      single-line
                      solo
                      dark
                      disabled
                      :value="item.Blocks"
                    ></v-text-field
                  ></v-flex>
                  <v-flex mr-2 xs6 md3 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Avg. Percentage of Business Units 
                    </span>
                  </v-flex>
                  <v-flex xs12 md7 mt-2 mb-2>
                    <v-text-field
                      style="min-height: 35px !important; "
                      single-line
                      solo
                      dark
                      disabled
                      :value="item.Business"
                    ></v-text-field
                  ></v-flex>

                  <v-flex mr-2 xs6 md3 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Avg. Occupancy Rate 
                    </span>
                  </v-flex>
                  <v-flex mr-2 xs12 md7 mt-2 mb-2>
                    <v-text-field
                      style="min-height: 35px !important; "
                      single-line
                      solo
                      dark
                      disabled
                      :value="item.Occupancy"
                    ></v-text-field
                  ></v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-flex>
      <!-- </v-card> -->
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  layout: "site_manager_layout",
  middleware: "authenticated",
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser", "userGroups"])
  },
  async asyncData({ app, _, __ }) {
    let { data } = await app.$axios.post("report");
    let x = await app.$axios.post("overall");
    let y = await app.$axios.post("week");
    console.log(y.data);
    return {
      baseFILEURL: "https://vispsites.websprix.com/",
      report_data: data,
      overall: x.data[0],
      week: y.data
    };
  }
};
</script>
<style>
.nash {
  font-family: Ubuntu !important;
  font-size: 20px !important;
  color: #fff !important;
}
.nash2 {
  font-family: Ubuntu !important;
  font-size: 12px !important;
}
.whole-card {
  font-family: Ubuntu !important;
  background-color: #ffffff !important;
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
</style>
