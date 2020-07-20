<template>
  <v-layout>
  
    <v-card class="whole-card">
        <v-flex align-start>
        <v-subheader class="">
          <span
            style="font-size: 25px; font-family: Ubuntu !important; font-weight: 1000 !important;"
          >
            Overall Sites Summary

          </span>
        </v-subheader>
        <v-layout row wrap>
        <v-flex md4>
          
        
         <v-card max-width="400" class="mr-5 mt-2" flat style="background-color: white !important;">
                <v-toolbar height="20px" color="#fbe631" dark>
                  <v-toolbar-title class="nash black--text">Overall Summary</v-toolbar-title>
                </v-toolbar>
                <v-layout row wrap>
                  <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >Total No. of Sites -  <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ overall.count }}</strong
                      ></span>
                    </v-flex>
                      <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >No of Total Potential Customers - 
                     <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ overall.Customers }}</strong
                      ></span>
                    </v-flex>
                      <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >  Total No. of Blocks - <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ overall.Blocks }}</strong
                      ></span>
                    </v-flex>
                      <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >Avg. Percentage of Business Units -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ overall.Business + "%" }}</strong
                      ></span>
                    </v-flex>
                     <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Avg. Occupancy Rate -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ overall.Occupancy + "%" }}</strong
                      >
                    </span>
                  </v-flex>
                    </v-layout>
                    </v-card>
                    </v-flex>
                      <v-flex md8>
 <v-card max-width="400" class="mr-5 mt-2" flat style="background-color: white !important;">
                <v-toolbar height="20px" color="#fbe631" dark>
                  <v-toolbar-title class="nash black--text">Identified Sites - This Week</v-toolbar-title>
                </v-toolbar>
                <v-layout row wrap>
                  <v-flex xs6 md6 mt-2 mb-2 v-for="(item, i) in week" :key="i">
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    > *  <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{item.name}}</strong
                      ></span>
                    </v-flex>
                </v-layout>
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
                class="mr-5 mt-2"
                flat
                style="background-color: white !important;"
              >
                <v-toolbar height="20px" color="#fbe631" dark>
                  <v-toolbar-title class="nash black--text">{{
                    item.status
                  }}</v-toolbar-title>
                </v-toolbar>
                <v-layout row wrap>
                  <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Total No. of Potential Customers -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ item.Customers }}</strong
                      >
                    </span>
                    <!-- <v-subheader>{{item.status}}</v-subheader> -->
                  </v-flex>

                  <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Total No. of Blocks -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ item.Blocks }}</strong
                      >
                    </span>
                  </v-flex>
                  <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Avg. Percentage of Business Units -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ item.Business + "%" }}</strong
                      >
                    </span>
                  </v-flex>

                  <v-flex xs6 md9 mt-2 mb-2>
                    <span
                      depressed
                      small
                      class="nash2 black--text"
                      style="font-weight: 1000 !important;"
                    >
                      Avg. Occupancy Rate -
                      <strong
                        style=" 
                      background-color: #fbe631 !important;"
                        >{{ item.Occupancy + "%" }}</strong
                      >
                    </span>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-flex>
    </v-card>
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
  font-size: 15px !important;
}
.nash2 {
  font-family: Ubuntu !important;
  font-size: 12px !important;
}
.whole-card {
  font-family: Ubuntu !important;
  background-color: #eeeeee !important;
}
</style>
