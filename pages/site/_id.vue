<template>
  <v-layout justify-center column>
    <v-card>
      <v-toolbar dense prominent class="white">
        <v-toolbar-title>Site:{{site.name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-layout column wrap>
            <v-flex>
              <v-subheader>Site Description</v-subheader>
            </v-flex>
            <v-flex class="text-xs-left pl-3 pt-3 elevation-3">
              <p>{{site.description}}</p>
            </v-flex>
            <v-flex class="mt-3">
              <v-divider class="indigo"></v-divider>
            </v-flex>
            <v-flex>
              <v-subheader>Site Location</v-subheader>
            </v-flex>
            <v-flex class="text-xs-left">
              <v-layout column>
                <v-flex>
                  <v-btn dark>{{site.location}}</v-btn>
                </v-flex>
                <v-flex>
                  <v-btn
                    target="_blank"
                    :href="'https://google.com/maps/search/?api=1&query='+site.latitude+','+site.longitude"
                  >open in google maps
                    <v-icon>url_launch</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="mt-3">
              <v-divider class="indigo"></v-divider>
            </v-flex>
            <v-flex>
              <v-layout
                row
                wrap
                justify-start
                class="mt-2"
                v-if="loggedInUser.organization !='EthioTel'"
              >
                <v-subheader>Attached Files</v-subheader>
                <template v-for="item in site.files">
                  <v-flex :key="item.file_id" md1 xs12>
                    <v-tooltip bottom>
                      <template v-slot:activator="{on}">
                        <v-btn
                          v-on="on"
                          dark
                          :href="'http://196.189.44.14/api/getSiteFile/'+item.filename"
                        >file
                          <v-icon color="orange">insert_drive_file</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.filename}}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
            </v-flex>
            <v-flex class="mt-3">
              <v-divider class="indigo"></v-divider>
            </v-flex>
            <v-flex v-if="site.market_analysis_done==1 && loggedInUser.organization != 'EthioTel'">
              <v-subheader>Marketing Analysis Report</v-subheader>
            </v-flex>
            <v-expansion-panel
              v-if="site.market_analysis_done==1 && loggedInUser.organization != 'EthioTel'"
            >
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>Report</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-flex>
                      <v-layout row class="elevation-3 pa-2" wrap>
                        <v-flex md6 xs12>
                          <v-subheader>Report Data</v-subheader>
                          <v-layout column>
                            <v-flex>
                              <v-layout row>
                                <v-flex xs12 md2>
                                  <v-subheader class="black--text">No of Potential Customers</v-subheader>
                                </v-flex>
                                <v-flex xs12 md2>
                                  <v-text-field
                                    solo
                                    label="Potential Customers"
                                    disabled
                                    v-model="marketingReport.no_potential_customers"
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                            <v-flex>
                              <v-layout row>
                                <v-flex xs12 md2>
                                  <v-subheader class="black--text">Is Site Feasible</v-subheader>
                                </v-flex>
                                <v-flex xs12 md2>
                                  <v-checkbox disabled v-model="marketingReport.is_feasible"/>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                            <v-flex>
                              <v-layout row>
                                <v-flex xs12 md2>
                                  <v-subheader class="black--text">Description</v-subheader>
                                </v-flex>
                                <v-flex xs12 md4>
                                  <v-textarea
                                    solo
                                    label="Potential Customers"
                                    disabled
                                    :value="marketingReport.description"
                                  ></v-textarea>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex md6 class="mr-auto" xs12>
                          <v-subheader>Attached Files</v-subheader>
                          <v-layout row wrap>
                            <template v-for="item in marketingReport.files">
                              <v-flex :key="item.file_id" md4 xs12>
                                <v-btn
                                  dark
                                  :href="'http://196.189.44.14/api/getMarketFile/'+item.filename"
                                >
                                  {{item.filename}}
                                  <v-icon color="orange">insert_drive_file</v-icon>
                                </v-btn>
                              </v-flex>
                            </template>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-flex class="mt-3">
              <v-divider class="indigo"></v-divider>
            </v-flex>
            <v-flex>
              <v-subheader>Site status History</v-subheader>
            </v-flex>
            <v-flex>
              <v-data-table :headers="headers" :items="items" class="elevation-5">
                <template v-slot:items="props">
                  <td>{{site.name }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.username }}</td>
                  <td class="text-xs-left">{{ calcTimeElapsed(props.item)}}</td>
                  <td class="text-xs-center">
                    <v-btn
                      dark
                      @click="openModal(props.item,site.site_id,props.item.status)"
                    >view-status</v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-toolbar class="white elevation-12">
          <v-toolbar-side-icon>
            <v-icon @click="closeDialog">close</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>{{site.name}}|{{modalSite.status}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-lg fluid>
            <v-layout row wrap>
              <v-flex xs12 md6 class="elevation-3">
                <v-layout column>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex xs12 md4>
                        <v-subheader>Detailed Status Description</v-subheader>
                      </v-flex>
                      <v-flex xs12 md7>
                        <v-textarea box disabled v-model="modalSite.description"></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout row wrap justify-start v-if="loggedInUser.organization !='EthioTel'">
                      <v-subheader>Attached Files</v-subheader>
                      <template v-for="item in modalSite.files">
                        <v-flex :key="item.file_id" md1 xs12>
                          <v-btn
                            dark
                            :href="'http://196.189.44.14/api/getStatusFile/'+item.filename"
                          >
                            {{item.filename}}
                            <v-icon color="orange">insert_drive_file</v-icon>
                          </v-btn>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6 class="elevation-5">
                <v-layout column>
                  <v-flex>
                    <v-form class="elevation-5" v-if="loggedInUser.organization !='EthioTel'">
                      <v-subheader>Post Comment</v-subheader>
                      <v-layout column>
                        <v-flex>
                          <v-layout row wrap>
                            <v-flex md2>
                              <v-subheader>comment</v-subheader>
                            </v-flex>
                            <v-flex md9>
                              <v-textarea box v-model="commentForm.comments"></v-textarea>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex justify-center>
                          <v-layout row wrap>
                            <v-flex xs6 md2>
                              <v-subheader>Flag Comment</v-subheader>
                            </v-flex>
                            <v-flex md6 xs6>
                              <v-checkbox label="WebSprix Only!" v-model="commentForm.flagged"></v-checkbox>
                              <v-btn dark @click.stop="postComments(modalSite.status)">submit</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-flex>
                  <v-flex>
                    <v-subheader>previous Comments</v-subheader>
                    <v-list two-line v-if="comments.length>0">
                      <template v-for="(item) in comments">
                        <v-list-tile :key="item.com_id">
                          <v-list-tile-avatar
                            color="indigo lighten-2"
                            class="white--text"
                          >{{item.username.charAt(0)}}</v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile v-html="item.comment"></v-list-tile>
                            <v-list-tile-sub-title v-html="item.username+':-\t'+item.created_at"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </v-list>
                    <v-layout v-else align-center justify-center>
                      <v-flex>
                        <h3 class="body-2 text-xs-left ml-5">no Comments yet</h3>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  layout: "site_manager_layout",
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },
  asyncData({ params }) {
    return {
      id: params.id,
      site: {},
      dialog: false,
      comments: [],
      headers: [
        {
          text: "Site Name",
          align: "left",
          sortable: false
        },
        { text: "Status Description", value: "description" },
        { text: "Created By", value: "username" },
        { text: "Time Elapsed", value: "", sortable: false },
        { text: "", value: "", sortable: false }
      ],
      modalSite: {},
      marketingReport: [],
      items: [],
      commentForm: {
        comments: "",
        flagged: true
      }
    };
  },
  mounted() {
    this.$axios.post("single_site/" + this.id).then(result => {
      this.site = result.data[0];
      if (this.site.market_analysis_done == 1) {
        this.$axios
          .post("get_market_analysis/" + this.site.name.split(" ").join("_"))
          .then(data => {
            this.marketingReport = data.data[0];
            console.log(this.marketingReport);
          });
      }
    });
    this.$axios.post("site_status/" + this.id).then(result => {
      this.items = result.data;
    });
  },

  methods: {
    humanize(date) {
      return moment
        .duration(moment(date).diff(moment(new Date())))
        .humanize(true);
    },
    calcTimeElapsed(siteinfo) {
      console.log(siteinfo);
      switch (siteinfo.status) {
        case "Site Identified":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Survey Requested":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Survey Completed":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Payment Made":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Ethio Telecom Provision":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Configuration":
          return moment
            .duration(
              moment(siteinfo.dateVal).diff(
                this.getComaprisonDate(siteinfo.status, this.items)
              )
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Activated":
          return moment(siteinfo.dateVal).format();
          break;
        default:
          return moment.duration(1, "second").humanize(true);
          break;
      }
    },
    async postComments(status) {
      try {
        await this.$axios.post("comment", {
          status: status,
          site_id: this.site.site_id,
          comment: this.commentForm.comments,
          flagged: this.commentForm.flagged == true ? 1 : 0
        });
      } catch (e) {
        console.log(e);
      }
    },
    closeDialog() {
      this.comments = [];
      this.commentForm = {
        comments: "",
        flagged: true
      };
      this.dialog = false;
    },
    async openModal(site, siteId, status) {
      let { data } = await this.$axios.post(
        "getComments/" + siteId + "/" + status.split(" ").join("_")
      );
      this.comments = [...data];
      this.commentForm = {
        comments: "",
        flagged: true
      };
      this.modalSite = site;
      this.dialog = true;
    },
    getComaprisonDate(status, Allstats) {
      console.log("Requested status" + status);
      console.log("Array before Filter", Allstats);
      let filtered_array = Allstats.filter(sites => {
        return sites.status === this.getNextStatus(status);
      });
      console.log("Filtered Array", filtered_array);
      if (filtered_array.length > 0) {
        return filtered_array[0].dateVal;
        console.log(
          "Got status: " +
            status +
            " returned Data: " +
            filtered_array[0].dateVal
        );
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
        case "Site Configuration":
          return "Site Activated";
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

