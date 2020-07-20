<template>
  <v-layout justify-center column>
    <v-card>
      <v-toolbar dense class="white">
        <v-toolbar-title>{{site.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn dark>{{site.location}}</v-btn>
        </v-toolbar-items>
        <v-toolbar-side-icon
          target="_blank"
          :href="'https://google.com/maps/search/?api=1&query='+site.latitude+','+site.longitude"
        >
          <v-icon>launch</v-icon>
        </v-toolbar-side-icon>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-layout column wrap>
            <v-flex>
              <v-subheader>Recent Site Description</v-subheader>
            </v-flex>
            <v-flex class="text-xs-left pl-3 pt-3 elevation-3">
              <p>{{site.description}}</p>
            </v-flex>
            <v-flex md12>
              <v-divider class="indigo mt-3"></v-divider>
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
                <v-carousel v-if="site.files.length > 0">
                  <v-carousel-item
                    v-for="(item, index) in site.files"
                    :key="index"
                  >
                    <v-img
                      :src="baseFILEURL+item.filename"
                      class="grey lighten-2"
                      v-if="isEmbeddableFile(item.filename)"
                    ></v-img>
                    <v-btn v-else dark :href="baseFILEURL+item.filename" target="_blank">
                      {{item.filename}}
                      <v-icon color="#fbe631">insert_drive_file</v-icon>
                    </v-btn>
                  </v-carousel-item>
                </v-carousel>
              </v-layout>
              <div class="text-xs-center" v-if="site.files==0">
                <span class="grey--text body-2">No attached files</span>
              </div>
            </v-flex>
            <v-flex md12>
              <v-divider class="indigo mt-3"></v-divider>
            </v-flex>
            <!-- site.market_analysis_done==1 &&  -->
            <v-flex v-if="loggedInUser.organization != 'EthioTel'">
              <v-subheader>Marketing Analysis Report</v-subheader>
              <v-expansion-panel>
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
                                <v-layout row wrap>
                                  <v-flex xs12 md6>
                                    <v-subheader class="black--text">No of Potential Customers</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md6>
                                    <v-text-field
                                      solo
                                      label="Potential Customers"
                                      disabled
                                      :value="marketingReport.no_potential_customers"
                                    ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-flex>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Is Site Feasible?</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-checkbox disabled :value="1==marketingReport.is_feasible" />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Is Duct Available?</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-checkbox disabled :value="1==marketingReport.duct" />
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-flex>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Blocks</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.blocks"
                                    />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Units (Customer Per Block)</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.no_potential_customers / marketingReport.blocks"
                                    />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Occupancy Rate (Houses Occupied)</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.occupancy"
                                    />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Mobile Coverage</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field disabled :value="marketingReport.mobile" />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Average Rental (Birr)</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.rental"
                                    />
                                  </v-flex>
                                  <!-- <v-flex xs12 md3>
                                    <v-subheader class="black--text">Suitability for FTTH Rating</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.ftth + ' out of 10.'"
                                    />
                                  </v-flex> -->
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Percentage of Business Units</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field disabled :value="marketingReport.business + '%'" />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader
                                      class="black--text"
                                    >Average Area - (Per Square meters)</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.density"
                                    />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md6>
                                    <v-subheader class="black--text">Marketing Status Description</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md6>
                                    <v-textarea
                                      solo
                                      label="Description"
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
                              <v-carousel v-if="marketingReport.files.length > 0">
                                <v-carousel-item
                                  v-for="(item, index) in marketingReport.files"
                                  :key="index"
                                >
                                  <v-img
                                    :src="baseFILEURL+item.filename"
                                    class="grey lighten-2"
                                    style="width:100%; height:100%;"
                                    v-if="isEmbeddableFile(item.filename)"
                                  ></v-img>
                                  <v-btn
                                    v-else
                                    dark
                                    :href="baseFILEURL+item.filename"
                                    target="_blank"
                                  >
                                    {{item.filename}}
                                    <v-icon color="#fbe631">insert_drive_file</v-icon>
                                  </v-btn>
                                </v-carousel-item>
                              </v-carousel>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-flex md12>
                <v-divider class="indigo mt-3"></v-divider>
              </v-flex>
            </v-flex>
            <v-flex>
              <v-subheader>Site status History</v-subheader>
            </v-flex>
            <v-flex>
              <v-data-table :headers="headers" :items="items" class="elevation-5">
                <template v-slot:items="props">
                  <td class="text-xs-left">{{ calcTimeElapsed(props.item)}}</td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td>{{site.name }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.username }}</td>
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
          <v-toolbar-title>{{'Site name:-'+ site.name+' '}}| {{'Status:- '+ modalSite.status}}</v-toolbar-title>
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
                      <v-carousel v-if="modalSite.files.length > 0">
                        <v-carousel-item v-for="(item, index) in modalSite.files" :key="index">
                          <v-img
                            :src="baseFILEURL+item.filename"
                            class="grey lighten-2"
                            style="width:100%; height:100%;"
                            v-if="isEmbeddableFile(item.filename)"
                          ></v-img>
                          <v-btn v-else dark :href="baseFILEURL+item.filename" target="_blank">
                            {{item.filename}}
                            <v-icon color="#fbe631">insert_drive_file</v-icon>
                          </v-btn>
                        </v-carousel-item>
                      </v-carousel>
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
                    <v-list three-line v-if="comments.length>0">
                      <template v-for="(item) in comments">
                        <v-list-tile :key="item.com_id" class="mt-3">
                          <v-list-tile-avatar
                            color="indigo lighten-2"
                            class="white--text"
                          >{{item.username.charAt(0)}}</v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile
                              style="max-height: 100px"
                              class="scroll-y"
                              v-html="item.comment"
                            ></v-list-tile>
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
    <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
      {{snaackbar_message}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
  async asyncData({ app, params, _ }) {
    let { data } = await app.$axios.post("single_site/" + params.id);
    let marketingReport = await app.$axios.post(
      "get_market_analysis/" + data.name.split(" ").join("_")
    );
    return {
      id: params.id,
      site: data,
      dialog: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      baseFILEURL: "https://vispsites.websprix.com/",
      saveProgressHidden: true,
      comments: [],
      headers: [
        { text: "Created At", value: "dateVal", sortable: true },
        { text: "Status", value: "status" },
        {
          text: "Site Name",
          align: "left",
          sortable: false
        },
        { text: "Status Description", value: "description" },
        { text: "Created By", value: "username" },
        { text: "", value: "", sortable: false }
      ],
      modalSite: { files: [] },
      marketingReport: marketingReport.data[0],
      items: [],
      commentForm: {
        comments: "",
        flagged: true
      }
    };
  },
  mounted() {
    this.$axios.post("site_status/" + this.id).then(result => {
      let temp_data = result.data;
      temp_data.sort((obj1, obj2) => {
        if (moment(obj1.dateVal) > moment(obj2.dateVal)) return 1;
        if (moment(obj1.dateVal) < moment(obj2.dateVal)) return -1;
        return 0;
      });
      this.items = temp_data;
    });
  },

  methods: {
    humanize(date) {
      return moment
        .duration(moment(date).diff(moment(new Date())))
        .humanize(true);
    },
    calcTimeElapsed(siteinfo) {
      return moment(siteinfo.dateVal).format("LL");
    },
    getEmbeddableFiles(files) {
      return files.filter(data => {
        let ext = data.filename.split(".")[1];
        return ["png", "jpg", "jpeg"].includes(ext);
      });
    },
    isEmbeddableFile(value) {
      let ext = value.split(".")[1];
      return ["png", "jpg", "jpeg"].includes(ext);
    },
    async postComments(status) {
      try {
        await this.$axios.post("comment", {
          status: status,
          site_id: this.site.site_id,
          comment: this.commentForm.comments,
          flagged: this.commentForm.flagged == true ? 1 : 0
        });
        this.saveProgressHidden = true;
        this.snaackbar_message = "Comment Posted Succesfully";
        this.snackbar_type = "success";
        this.snackbar = true;
        this.dialog = false;
      } catch (e) {
        this.saveProgressHidden = true;
        this.snaackbar_message = "Oops there was some error";
        this.snackbar_type = "error";
        this.snackbar = true;
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
      let filtered_array = Allstats.filter(sites => {
        return sites.status === this.getNextStatus(status);
      });
      if (filtered_array.length > 0) {
        return filtered_array[0].dateVal;
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
