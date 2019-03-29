<template>
  <v-layout>
    <v-flex align-start>
      <v-subheader>All sites</v-subheader>
      <v-data-table :headers="headers" :items="filteredIems" light class="elevation-11">
        <template v-slot:items="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.location}}</td>
            <td class="text-xs-left">{{ props.item.status }}</td>
            <td class="text-xs-left">{{ calcTimeElapsed(props.item)}}</td>
            <td class="text-xs-left">
              <v-layout row wrap justify-space-between>
                <v-flex md4 v-if="checkAuthorization(props.item)">
                  <v-btn color="teal lighten-2" dark @click="openDialog(props.item)">
                    <span v-if="props.item.market_analysis_done==1">Update Status</span>
                    <span v-else>submit report</span>
                  </v-btn>
                </v-flex>
                <v-flex md4>
                  <v-btn dark @click="getRoute(props.item.site_id)">open site</v-btn>
                </v-flex>
                <v-flex md4 v-if="(loggedInUser.organization !='EthioTel')">
                  <v-btn dark :href="'/siteReport/'+props.item.site_id">Site Report</v-btn>
                </v-flex>
              </v-layout>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" fullscreen>
        <!-- Site update Form -->
        <v-card v-if="currentModalSite.market_analysis_done != 0">
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-icon @click="dialog = false" color="white">close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title class="white--text" v-text="currentModalSite.name"/>
            <v-spacer/>
            <v-toolbar-items class="hidden-xs-only">
              <v-btn flat color="white" @click="submitFiles(currentModalSite)">save
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-layout row justify-center>
            <v-card-text>
              <v-progress-linear
                indeterminate
                color="orange"
                height="2"
                :hidden="saveProgressHidden"
              ></v-progress-linear>
              <v-flex md7>
                <v-form ref="siteStatusForm">
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Status</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-text-field solo disabled :value="siteStatusUpdateForm.nextStat"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Status Update Date</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-date-picker
                        landscape
                        reactive
                        v-model="siteStatusUpdateForm.statusUpdateDate"
                      ></v-date-picker>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap class="mt-3">
                    <v-flex xs6 md6>
                      <v-subheader>Site Status Description</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-textarea
                        box
                        v-model="siteStatusUpdateForm.description"
                        label="Site status Description"
                        :rules="siteStatusUpdateFormRules.descriptionRules"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Choose Files</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-input class="mt-2 elevation-2">
                        <input
                          class="d-block"
                          type="file"
                          @change="handleFileUploads()"
                          ref="files"
                          id="files"
                          multiple
                        >
                      </v-input>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-flex>
            </v-card-text>
          </v-layout>
        </v-card>
        <!-- End[Site Update Form] -->
        <!-- Marketing analsyis form -->
        <v-card v-else>
          <v-toolbar dark>
            <v-toolbar-side-icon>
              <v-icon @click="dialog = false" color="white">close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title
              class="white--text"
              v-text="currentModalSite.name+'\t :- Marketing Analysis'"
            />
            <v-spacer/>
            <v-toolbar-items class="hidden-xs-only">
              <v-btn flat color="white" @click="submitMarketingFiles(currentModalSite)">save
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-layout row justify-center>
            <v-card-text>
              <v-progress-linear
                indeterminate
                color="orange"
                height="2"
                :hidden="saveProgressHidden"
              ></v-progress-linear>
              <v-flex md7>
                <v-form ref="marketingForm">
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Site Name</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-text-field
                        dark
                        class="white--text"
                        solo
                        disabled
                        :value="currentModalSite.name"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>No of Potential Customers</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-text-field type="number" solo v-model="marketingForm.potential"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Is Site Feasible?</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-checkbox label="yes" :value="marketingForm.is_feasible"></v-checkbox>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap class="mt-3">
                    <v-flex xs6 md6>
                      <v-subheader>Site Status Description</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-textarea
                        box
                        v-model="marketingForm.description"
                        label="Site status Description"
                        :rules="marketingFormRules.descriptionRules"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 md6>
                      <v-subheader>Choose Files</v-subheader>
                    </v-flex>
                    <v-flex xs6 md6>
                      <v-input class="mt-2 elevation-2">
                        <input
                          class="d-block"
                          type="file"
                          @change="handleFileUploads()"
                          ref="files"
                          id="files"
                          multiple
                        >
                      </v-input>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-flex>
            </v-card-text>
          </v-layout>
        </v-card>

        <!-- End[marketing analysis] -->
      </v-dialog>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
      {{snaackbar_message}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>
-----
<script>
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  layout: "site_manager_layout",
  middleware: "authenticated",
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    filteredIems() {
      if (this.loggedInUser.organization == "EthioTel")
        return this.items.filter(data => data.status != "Site Identified");
      else return this.items;
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Site Name",
          align: "left",
          value: "name"
        },
        { text: "Site Location", value: "location" },
        { text: "Recent Site Status", value: "status" },
        { text: "Time Elapsed", value: "", sortable: false }
      ],
      dialog: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      saveProgressHidden: true,
      items: [],
      files: "",
      siteStatusUpdateFormRules: {
        descriptionRules: [
          v => v.length > 0 || "Site description can't be empty"
        ]
      },
      marketingFormRules: {
        descriptionRules: [
          v => v.length > 0 || "Marketing Description can't empty"
        ]
      },
      siteStatusUpdateForm: {
        nextStat: "",
        description: "",
        statusUpdateDate: new Date().toISOString().substr(0, 10)
      },
      marketingForm: {
        potential: "",
        is_feasible: "",
        description: ""
      },
      currentModalSite: {}
    };
  },
  mounted() {
    this.$axios.post("sites").then(result => {
      this.items = [...result.data];
      console.log(this.items);
    });
  },
  methods: {
    calcTimeElapsed(siteinfo) {
      switch (siteinfo.status) {
        case "Site Identified":
          return moment
            .duration(moment(siteinfo.created_at).diff(moment(new Date())))
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Survey Requested":
          return moment
            .duration(
              moment(siteinfo.survey_request_date).diff(moment(new Date()))
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Survey Completed":
          return moment
            .duration(
              moment(siteinfo.survey_completed_date).diff(moment(new Date()))
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Payment Made":
          return moment
            .duration(
              moment(siteinfo.payment_processed_date).diff(moment(new Date()))
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Ethio Telecom Provision":
          return moment
            .duration(
              moment(siteinfo.ethio_telecom_pro_date).diff(moment(new Date()))
            )
            .humanize(true)
            .replace("ago", "");
          break;
        case "Site Configuration":
          return moment
            .duration(
              moment(siteinfo.site_configuration_date).diff(moment(new Date()))
            )
            .humanize(true)
            .replace("ago", "");
          break;

        case "Site Activated":
          return moment(siteinfo.activation_date).format();
          break;
        default:
          return moment.duration(1, "second").humanize(true);
          break;
      }
    },
    getRoute(siteId) {
      this.$router.push("site/" + siteId);
    },
    getNextStatus(siteStatus) {
      switch (siteStatus) {
        case "Site Identified":
          this.siteStatusUpdateForm.nextStat = "Site Survey Requested";
          break;
        case "Site Survey Requested":
          this.siteStatusUpdateForm.nextStat = "Site Survey Completed";
          break;
        case "Site Survey Completed":
          this.siteStatusUpdateForm.nextStat = "Site Payment Made";
          break;
        case "Site Payment Made":
          this.siteStatusUpdateForm.nextStat = "Ethio Telecom Provision";
          break;
        case "Ethio Telecom Provision":
          this.siteStatusUpdateForm.nextStat = "Site Configuration";
          break;
        case "Site Configuration":
          this.siteStatusUpdateForm.nextStat = "Site Activated";
          break;
        case "Site Activated":
          this.siteStatusUpdateForm.nextStat = "";
          break;
        default:
          this.siteStatusUpdateForm.nextStat = "";
          break;
      }
    },
    async submitFiles(site) {
      if (this.$refs.siteStatusForm.validate()) {
        let formData = new FormData();
        formData.append("site_id", site.site_id);
        formData.append("status", this.siteStatusUpdateForm.nextStat);
        formData.append(
          "createDate",
          this.siteStatusUpdateForm.statusUpdateDate
        );
        formData.append("description", this.siteStatusUpdateForm.description);
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formData.append("files[" + i + "]", file);
        }
        this.saveProgressHidden = false;
        try {
          await this.$axios.post("/create_status", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          this.saveProgressHidden = true;
          this.snaackbar_message = "Site Status updated Succesfully";
          this.snackbar_type = "success";
          this.snackbar = true;
          this.siteStatusUpdateForm = {
            nextStat: "",
            description: "",
            statusUpdateDate: new Date().toISOString().substr(0, 10)
          };
          this.dialog = false;
        } catch (e) {
          this.saveProgressHidden = true;
          this.snaackbar_message = "Oops there was some error";
          this.snackbar_type = "error";
          this.snackbar = true;
        }
      }
    },
    handleFileUploads() {
      this.files = this.$refs.files.files;
    },
    async submitMarketingFiles(site) {
      if (this.$refs.marketingForm.validate()) {
        let formData = new FormData();
        formData.append("name", site.name);
        formData.append("potential", this.marketingForm.potential);
        formData.append(
          "is_feasible",
          this.marketingForm.is_feasible == true ? 0 : 1
        );
        formData.append("description", this.marketingForm.description);
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formData.append("files[" + i + "]", file);
        }
        this.saveProgressHidden = false;
        try {
          await this.$axios.post("/create_market", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          this.saveProgressHidden = true;
          this.snaackbar_message = "Marketing analsyis completed Succesfully";
          this.snackbar_type = "success";
          this.snackbar = true;
          this.siteStatusUpdateForm = {
            nextStat: "",
            description: "",
            statusUpdateDate: new Date().toISOString().substr(0, 10)
          };
          this.dialog = false;
        } catch (e) {
          this.snaackbar_message = "Oops there was some error";
          this.snackbar_type = "error";
          this.snackbar = true;
        }
      }
    },
    openDialog(site) {
      this.currentModalSite = site;
      if (site.market_analysis_done != 0) {
        this.getNextStatus(site.status);
        this.dialog = true;
      }
      this.dialog = true;
    },
    closeDialog() {
      this.siteStatusUpdateForm = {
        nextStat: "",
        description: "",
        statusUpdateDate: new Date().toISOString().substr(0, 10)
      };
      this.marketingForm = {
        potential: "",
        is_feasible: "",
        description: ""
      };
      this.dialog = false;
    },
    checkAuthorization(site) {
      let authorizationResult;
      if (this.loggedInUser.organization === "EthioTel") {
        authorizationResult= false;
      } else if (
        site.market_analysis_done == 0 &&
        this.loggedInUser.role != "Marketing" &&
        this.loggedInUser.role != "admin"
      ) {
        authorizationResult= false;
      } else if (
        site.market_analysis_done == 1 &&
        this.loggedInUser.role != "Deployment" &&
        this.loggedInUser.role != "admin"
      ) {
        authorizationResult= false;
      } else {
        authorizationResult= true;
      }
      return authorizationResult;
    }
  }
};
</script>

