<template>
  <v-layout justify-center column>
    <v-card>
      <v-toolbar dense class="white">
        <v-toolbar-title>{{ site.name }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-xs-only">
          <v-btn dark>{{ site.location }}</v-btn>
        </v-toolbar-items>
        <v-toolbar-side-icon
          target="_blank"
          :href="
            'https://google.com/maps/search/?api=1&query=' +
              site.latitude +
              ',' +
              site.longitude
          "
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
              <p>{{ site.description }}</p>
            </v-flex>
            <v-flex md12>
              <v-divider class="indigo mt-3"></v-divider>
            </v-flex>
            <v-flex>
              <v-layout
                row
                wrap
                justify-center
                class="mt-2"
                v-if="loggedInUser.organization != 'EthioTel'"
              >
                <v-flex md8>
                  <v-subheader>Attached Files</v-subheader>
                  <v-carousel v-if="site.files.length > 0">
                    <v-carousel-item
                      :aspect-ratio="16 / 9"
                      v-for="(item, index) in site.files"
                      :key="index"
                    >
                      <v-responsive :aspect-ratio="16 / 9">
                        <v-img
                          :aspect-ratio="16 / 9"
                          :src="baseFILEURL + item.filename"
                          class="grey lighten-2"
                          v-if="isEmbeddableFile(item.filename)"
                        >
                          <v-fab-transition
                            v-if="
                              isEmbeddableFile(item.filename) &&
                                site.username.username == loggedInUser.username
                            "
                          >
                            <v-btn
                              style="margin-top: 30px;"
                              color="#FBE631"
                              fab
                              dark
                              small
                              absolute
                              top
                              right
                              @click="deleteImage(item.file_id)"
                            >
                              <v-icon color="black">close</v-icon>
                            </v-btn>
                          </v-fab-transition>
                        </v-img>
                        <div v-else>
                          <v-btn
                            dark
                            :href="baseFILEURL + item.filename"
                            target="_blank"
                          >
                            {{ item.filename }}
                            <v-icon color="#fbe631">insert_drive_file</v-icon>
                          </v-btn>
                          <v-fab-transition>
                            <v-btn
                              v-if="
                                site.username.username == loggedInUser.username
                              "
                              style=" margin-top: 30px;"
                              color="#FBE631"
                              fab
                              dark
                              small
                              absolute
                              top
                              right
                              @click="deleteImage(item.file_id)"
                            >
                              <v-icon color="black">close</v-icon>
                            </v-btn>
                          </v-fab-transition>
                        </div>
                      </v-responsive>
                    </v-carousel-item>
                  </v-carousel>
                </v-flex>
              </v-layout>

              <div class="text-xs-center" v-if="site.files == 0">
                <span class="grey--text body-2">No attached files</span>
              </div>
            </v-flex>
            <v-flex
              v-if="loggedInUser.organization != 'EthioTel' && site.omu != null"
            >
              <v-subheader>MOU Status Report</v-subheader>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <template v-slot:header>
                    <div>MOU Status</div>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-flex>
                        <v-layout row class="elevation-3 pa-2" wrap>
                          <v-flex md12 xs12>
                            <v-layout row wrap>
                              <v-flex xs12 md3>
                                <v-subheader>MOU Status</v-subheader>
                              </v-flex>
                              <v-flex xs12 md3>
                                <v-text-field
                                  label="MOU Status"
                                  disabled
                                  :value="site.omu.status"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                            <v-flex v-if="site.omu.status == 'Signed'">
                              <v-layout
                                row
                                wrap
                                justify-center
                                class="mt-2"
                                v-if="loggedInUser.organization != 'EthioTel'"
                              >
                                <v-flex md8>
                                  <v-subheader>Attached Files</v-subheader>

                                  <v-responsive
                                    height="120"
                                    :aspect-ratio="16 / 9"
                                  >
                                    <v-img
                                      :aspect-ratio="16 / 9"
                                      :src="baseFILEURL + site.omu.filename"
                                      class="grey lighten-2"
                                      v-if="isEmbeddableFile(site.omu.filename)"
                                    >
                                    </v-img>
                                    <div v-else>
                                      <v-btn
                                        dark
                                        :href="baseFILEURL + site.omu.filename"
                                        target="_blank"
                                      >
                                        {{ site.omu.filename }}
                                        <v-icon color="#fbe631"
                                          >insert_drive_file</v-icon
                                        >
                                      </v-btn>
                                    </div>
                                  </v-responsive>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                          </v-flex>
                        </v-layout>
                      </v-flex>

                      <v-layout row wrap justify-center align-center>
                        <v-flex md8 class="mr-auto" xs12>
                          <v-subheader>Attached Files</v-subheader>
                          <v-layout row wrap>
                            <v-carousel
                              height="480"
                              v-if="marketingReport.files.length > 0"
                            >
                              <v-carousel-item
                                :aspect-ratio="16 / 9"
                                v-for="(item, index) in marketingReport.files"
                                :key="index"
                              >
                                <v-responsive :aspect-ratio="16 / 9">
                                  <v-img
                                    :aspect-ratio="16 / 9"
                                    height="480"
                                    :src="baseFILEURL + item.filename"
                                    class="grey lighten-2"
                                    style="width:100%; height:100%;"
                                    v-if="isEmbeddableFile(item.filename)"
                                  ></v-img>
                                  <v-btn
                                    v-else
                                    dark
                                    :href="baseFILEURL + item.filename"
                                    target="_blank"
                                  >
                                    {{ item.filename }}
                                    <v-icon color="#fbe631"
                                      >insert_drive_file</v-icon
                                    >
                                  </v-btn>
                                </v-responsive>
                              </v-carousel-item>
                            </v-carousel>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-flex md12>
                <v-divider class="indigo mt-3"></v-divider>
              </v-flex>
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
                          <v-flex md12 xs12>
                            <v-subheader>Report Data</v-subheader>
                            <div style="overflow-x:auto;">
                              <table class="blueTable">
                                <tr>
                                  <th>No. Potential Customers</th>
                                  <th>Is Site Feasible?</th>
                                  <th>Is Duct Available</th>
                                  <th>Blocks</th>
                                  <th>Units (Customers Per Block)</th>
                                  <th>Occupancy Rate (Houses Occupied)</th>
                                  <th>Mobile Coverage</th>
                                  <th>Average Rental (Birr)</th>
                                  <th>Percentage of Business Units</th>
                                  <th>Average Area - (Per Square meters)</th>
                                </tr>
                                <tr>
                                  <td>
                                    {{ marketingReport.no_potential_customers }}
                                  </td>
                                  <td>
                                    <v-layout row wrap>
                                      <v-flex xs12 md3>
                                        <v-checkbox
                                          disabled
                                          :value="
                                            1 == marketingReport.is_feasible
                                          "
                                        /> </v-flex
                                    ></v-layout>
                                  </td>
                                  <td>
                                    <v-layout row wrap>
                                      <v-flex xs12 md3>
                                        <v-checkbox
                                          disabled
                                          :value="1 == marketingReport.duct"
                                        />
                                      </v-flex>
                                    </v-layout>
                                  </td>
                                  <td>{{ marketingReport.blocks }}</td>
                                  <td>
                                    {{
                                      marketingReport.blocks == 0
                                        ? "Not Set"
                                        : Math.ceil(
                                            parseInt(
                                              marketingReport.no_potential_customers
                                            ) / parseInt(marketingReport.blocks)
                                          )
                                    }}
                                  </td>
                                  <td>{{ marketingReport.occupancy }}</td>
                                  <td>{{ marketingReport.mobile }}</td>
                                  <td>{{ marketingReport.rental }}</td>

                                  <td>{{ marketingReport.business + "%" }}</td>
                                  <td>{{ marketingReport.density }}</td>
                                </tr>
                              </table>

                              <v-flex>
                                <v-subheader
                                  >Marketing Analysis Description</v-subheader
                                >
                              </v-flex>
                              <v-flex
                                class="text-xs-left pl-3 pt-3 elevation-3"
                              >
                                <p>{{ marketingReport.description }}</p>
                              </v-flex>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>

                      <v-layout row wrap justify-center align-center>
                        <v-flex md8 class="mr-auto" xs12>
                          <v-subheader>Attached Files</v-subheader>
                          <v-layout row wrap>
                            <v-carousel
                              height="480"
                              v-if="marketingReport.files.length > 0"
                            >
                              <v-carousel-item
                                :aspect-ratio="16 / 9"
                                v-for="(item, index) in marketingReport.files"
                                :key="index"
                              >
                                <v-responsive :aspect-ratio="16 / 9">
                                  <v-img
                                    :aspect-ratio="16 / 9"
                                    height="480"
                                    :src="baseFILEURL + item.filename"
                                    class="grey lighten-2"
                                    style="width:100%; height:100%;"
                                    v-if="isEmbeddableFile(item.filename)"
                                  >
                                    <v-fab-transition
                                      v-if="
                                        isEmbeddableFile(item.filename) &&
                                          site.username.username ==
                                            loggedInUser.username
                                      "
                                    >
                                      <v-btn
                                        style="margin-top: 30px;"
                                        color="#FBE631"
                                        fab
                                        dark
                                        small
                                        absolute
                                        top
                                        right
                                        @click="deletemImage(item.file_id)"
                                      >
                                        <v-icon color="black">close</v-icon>
                                      </v-btn>
                                    </v-fab-transition>
                                  </v-img>
                                  <div v-else>
                                    <v-fab-transition>
                                      <v-btn
                                        v-if="
                                          site.username.username ==
                                            loggedInUser.username
                                        "
                                        style=" margin-top: 30px;"
                                        color="#FBE631"
                                        fab
                                        dark
                                        small
                                        absolute
                                        top
                                        right
                                        @click="deletemImage(item.file_id)"
                                      >
                                        <v-icon color="black">close</v-icon>
                                      </v-btn>
                                    </v-fab-transition>
                                    <v-btn
                                      dark
                                      :href="baseFILEURL + item.filename"
                                      target="_blank"
                                    >
                                      {{ item.filename }}
                                      <v-icon color="#fbe631"
                                        >insert_drive_file</v-icon
                                      >
                                    </v-btn>
                                  </div>
                                </v-responsive>
                              </v-carousel-item>
                            </v-carousel>
                          </v-layout>
                        </v-flex>
                      </v-layout>
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
              <v-data-table
                :headers="headers"
                :items="items"
                class="elevation-5"
              >
                <template v-slot:items="props">
                  <td class="text-xs-left">
                    {{ calcTimeElapsed(props.item) }}
                  </td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td>{{ site.name }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.username }}</td>
                  <td class="text-xs-center">
                    <v-btn
                      dark
                      @click="
                        openModal(props.item, site.site_id, props.item.status)
                      "
                      >view-status</v-btn
                    >
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
          <v-toolbar-title
            >{{ "Site name:-" + site.name + " " }}|
            {{ "Status:- " + modalSite.status }}</v-toolbar-title
          >
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
                        <v-textarea
                          box
                          disabled
                          v-model="modalSite.description"
                        ></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout
                      row
                      wrap
                      justify-start
                      v-if="loggedInUser.organization != 'EthioTel'"
                    >
                      <v-subheader>Attached Files</v-subheader>
                      <v-carousel
                        height="320"
                        v-if="modalSite.files.length > 0"
                      >
                        <v-carousel-item
                          v-for="(item, index) in modalSite.files"
                          :key="index"
                        >
                          <v-responsive :aspect-ratio="16 / 9">
                            <v-img
                              :aspect-ratio="16 / 9"
                              :src="baseFILEURL + item.filename"
                              class="grey lighten-2"
                              style="width:100%; height:100%;"
                              v-if="isEmbeddableFile(item.filename)"
                            ></v-img>
                            <v-btn
                              v-else
                              dark
                              :href="baseFILEURL + item.filename"
                              target="_blank"
                            >
                              {{ item.filename }}
                              <v-icon color="#fbe631">insert_drive_file</v-icon>
                            </v-btn>
                          </v-responsive>
                        </v-carousel-item>
                      </v-carousel>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6 class="elevation-5">
                <v-layout column>
                  <v-flex>
                    <v-form
                      class="elevation-5"
                      v-if="loggedInUser.organization != 'EthioTel'"
                    >
                      <v-subheader>Post Comment</v-subheader>
                      <v-layout column>
                        <v-flex>
                          <v-layout row wrap>
                            <v-flex md2>
                              <v-subheader>comment</v-subheader>
                            </v-flex>
                            <v-flex md9>
                              <v-textarea
                                box
                                v-model="commentForm.comments"
                              ></v-textarea>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex justify-center>
                          <v-layout row wrap>
                            <v-flex xs6 md2>
                              <v-subheader>Flag Comment</v-subheader>
                            </v-flex>
                            <v-flex md6 xs6>
                              <v-checkbox
                                label="WebSprix Only!"
                                v-model="commentForm.flagged"
                              ></v-checkbox>
                              <v-btn
                                dark
                                @click.stop="postComments(modalSite.status)"
                                >submit</v-btn
                              >
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-flex>
                  <v-flex>
                    <v-subheader>previous Comments</v-subheader>
                    <v-list three-line v-if="comments.length > 0">
                      <template v-for="item in comments">
                        <v-list-tile :key="item.com_id" class="mt-3">
                          <v-list-tile-avatar
                            color="indigo lighten-2"
                            class="white--text"
                            >{{ item.username.charAt(0) }}</v-list-tile-avatar
                          >
                          <v-list-tile-content>
                            <v-list-tile
                              style="max-height: 100px"
                              class="scroll-y"
                              v-html="item.comment"
                            ></v-list-tile>
                            <v-list-tile-sub-title
                              v-html="item.username + ':-\t' + item.created_at"
                            ></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </v-list>
                    <v-layout v-else align-center justify-center>
                      <v-flex>
                        <h3 class="body-2 text-xs-left ml-5">
                          no Comments yet
                        </h3>
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
    <v-snackbar
      v-model="snackbar"
      :color="snackbar_type"
      :timeout="timeout"
      :top="true"
    >
      {{ snaackbar_message }}
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
    async deleteImage(file_id) {
      try {
        await this.$axios.post("/delete_image/" + file_id);
        this.saveProgressHidden = true;
        this.snaackbar_message = "Image Deleted Succesfully";
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
    async deletemImage(file_id) {
      try {
        await this.$axios.post("/delete_image2/" + file_id);
        this.saveProgressHidden = true;
        this.snaackbar_message = "Image Deleted Succesfully";
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
<style>
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
