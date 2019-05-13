<template>
  <v-layout>
    <v-flex align-start>
      <v-subheader>
        <span>All sites</span>
        <v-spacer></v-spacer>

        <v-flex xs12 sm4 d-flex v-if="loggedInUser.organization !='EthioTel'">
          <v-select :items="selects" label="Filter Sites" v-model="selectedCategory"></v-select>
        </v-flex>
      </v-subheader>
      <v-data-table
        :pagination.sync="pagination"
        :headers="headers"
        :items="filteredIems"
        dark
        class="elevation-11"
        :rows-per-page-items="rows_per_page_items"
      >
        <template v-slot:items="props">
          <tr>
            <td style="max-width:150px;">{{ props.item.name }}</td>
            <td class="text-xs-left" style="max-width:380px;">{{ props.item.location}}</td>
            <td
              class="text-xs-left font-weight-bold elevation-2"
              style="max-width:50px;"
              :class="getStatusColor(props.item.status)"
            >{{ props.item.is_dead == 0 ? props.item.status+"- No Go" : props.item.status }}</td>
            <td class="text-xs-left" style="max-width:100px;">{{ calcTimeElapsed(props.item)}}</td>
            <td class="text-xs-left">
              <v-layout row wrap justify-space-around class="mb-2">
                <v-flex md2 v-if="checkAuthorization(props.item) && props.item.status != 'Site Activated'">
                  <v-tooltip slot="append" bottom>
                    <v-btn
                      v-if="buttonAuth(props.item,'update') && props.item.is_dead==1"
                      slot="activator"
                      @click="openDialog(props.item)"
                    >
                      <v-icon color="teal lighten-2" dark>update</v-icon>
                    </v-btn>
                    <span>Update Status</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md2 v-if="checkAuthorization(props.item)">
                  <v-tooltip slot="append" bottom>
                    <v-btn
                      slot="activator"
                      @click="editSiteDialog(props.item)"
                      dark
                      color="orange darken-2"
                    >
                      <v-icon color="black darken-2">edit</v-icon>
                    </v-btn>
                    <span>Edit Site</span>
                  </v-tooltip>
                </v-flex>
                <!-- <v-flex md2 v-if="checkAuthorization(props.item)">
                  <v-btn
                    v-if="buttonAuth(props.item,'update') && props.item.is_dead==1"
                    color="teal lighten-2"
                    dark
                    @click="openDialog(props.item)"
                  >
                    <v-icon>list</v-icon>
                  </v-btn>
                </v-flex>-->
                <v-flex md2>
                  <v-tooltip slot="append" bottom>
                    <v-btn
                      slot="activator"
                      color="grey darken-2"
                      dark
                      @click="getRoute(props.item.site_id)"
                    >
                      <v-icon color="white">info</v-icon>
                    </v-btn>
                    <span>Open Site</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md2 v-if="checkAuthorization(props.item)">
                  <v-tooltip slot="append" bottom>
                    <v-btn
                      color="blue lighten-2"
                      slot="activator"
                      v-if="buttonAuth(props.item,'mark')"
                      @click="openDialog(props.item, true)"
                    >
                      <v-icon color="black">widgets</v-icon>
                    </v-btn>

                    <span>Update Report</span>
                  </v-tooltip>
                </v-flex>

                <v-flex md2 v-if="(loggedInUser.organization !='EthioTel')">
                  <v-tooltip bottom slot="append">
                    <v-btn slot="activator" dark :href="'/siteReport/'+props.item.site_id">
                      <v-icon color="yellow darken-2" dark>assessment</v-icon>
                    </v-btn>
                    <span>Site Report</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!-- Update Status/ Report Dialog -->
      <v-dialog v-model="dialog" fullscreen>
        <!-- Site update Form -->
        <v-card v-if="currentModalSite.market_analysis_done != 0 && !na">
          <v-toolbar dark fixed>
            <v-toolbar-side-icon>
              <v-icon @click="dialog = false" color="white">close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title class="white--text" v-text="currentModalSite.name"/>
            <v-spacer/>
            <v-toolbar-side-icon @click="submitFiles(currentModalSite)">
              <v-icon>save</v-icon>
            </v-toolbar-side-icon>
          </v-toolbar>
          <v-layout row justify-center class="mt-5">
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
                    <v-flex xs12 md6>
                      <v-subheader>Status</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field solo disabled :value="siteStatusUpdateForm.nextStat"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Status Update Date</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-date-picker reactive v-model="siteStatusUpdateForm.statusUpdateDate"></v-date-picker>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap class="mt-3">
                    <v-flex xs12 md6>
                      <v-subheader>Site Status Description</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-textarea
                        box
                        v-model="siteStatusUpdateForm.description"
                        label="Site status Description"
                        :rules="siteStatusUpdateFormRules.descriptionRules"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Choose Files</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
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
          <v-toolbar dark fixed>
            <v-toolbar-side-icon>
              <v-icon @click="dialog = false" color="white">close</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title
              class="white--text"
              v-text="currentModalSite.name+'\t :- Marketing Analysis'"
            />
            <v-spacer/>
            <v-toolbar-side-icon @click="submitMarketingFiles(currentModalSite)">
              <v-icon>save</v-icon>
            </v-toolbar-side-icon>
          </v-toolbar>
          <v-layout row justify-center class="mt-5">
            <v-card-text class="mt-3">
              <v-progress-linear
                indeterminate
                color="orange"
                height="2"
                :hidden="saveProgressHidden"
              ></v-progress-linear>
              <v-flex md7>
                <v-form ref="marketingForm">
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Site Name</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
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
                    <v-flex xs12 md6>
                      <v-subheader>No of Potential Customers</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.potential"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Mobile Connection</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field solo v-model="marketingForm.mobile"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>No of Blocks</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.blocks"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Percentage of Business Units</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.business"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Occupancy Rate</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.occupancy"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>No of Units</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.units"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Average Rental</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.rental"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Is Duct Available?</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-checkbox
                        label="yes"
                        value="1"
                        :disabled="loggedInUser.role=='Marketing'"
                        v-model="marketingForm.duct"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Suitability for FTTH(Rating 1 - 10)</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role == 'Marketing'"
                        solo
                        v-model="marketingForm.ftth"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Average Density (Units per Square KM.)</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        type="number"
                        :disabled="loggedInUser.role=='Deployment'"
                        solo
                        v-model="marketingForm.density"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Is Site Feasible?</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-checkbox
                        v-if="loggedInUser.is_admin == 1 && loggedInUser.role == 'Marketing'"
                        value="1"
                        v-model="marketingForm.is_feasible"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap class="mt-3">
                    <v-flex xs12 md6>
                      <v-subheader>Site Status Description</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-textarea
                        box
                        :disabled="loggedInUser.role=='Deployment'"
                        v-model="marketingForm.description"
                        label="Site status Description"
                        :rules="marketingFormRules.descriptionRules"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-subheader>Choose Files</v-subheader>
                    </v-flex>
                    <v-flex xs12 md6>
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
      <!-- End of Dialog -->
      <!-- Update Site -->
      <v-dialog v-model="edit_Dialog">
        <v-card>
          <v-card-text>
            <v-form ref="editSite">
              <v-layout column>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>Site Name</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field
                      label="Site Name"
                      outline
                      v-model="site.name"
                      :rules="rules.nameRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>Site Location</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-textarea
                      label="Site Location"
                      outline
                      placeholder="general site location"
                      :rules="rules.locationRules"
                      v-model="site.location"
                      :value="siteStat"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>Location Latitude</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field
                      type="number"
                      outline
                      label="Latitude"
                      placeholder=" 9.005401"
                      v-model="site.latitude"
                      :rules="rules.latRules"
                      :value="site.latitide"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>Location Longtitude</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-textarea
                      type="number"
                      label="longitude"
                      placeholder="38.763611"
                      outline
                      v-model="site.longitude"
                      :rules="rules.latRules"
                      :value="site.longitude"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>is Site Ongoing</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-checkbox label value="1" v-model="site.is_dead"></v-checkbox>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md3>
                    <v-subheader>Site Description</v-subheader>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-textarea box v-model="site.description" label="Site status Description"></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md3>
                    <v-subheader>Choose Files</v-subheader>
                  </v-flex>
                  <v-flex xs6 md3>
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
              </v-layout>
              <v-flex xs12 md3 class="ml-auto mr-auto">
                <v-btn @click="submitEditedFiles">Update</v-btn>
              </v-flex>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End of Update Site -->
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
        return this.items.filter(
          data =>
            data.status != "Site Identified" && data.status != "Site Activated"
        );
      if (this.selectedCategory == "All Sites") {
        return this.items.filter(
          data => data.is_dead == 1 && data.status != "Site Activated"
        );
      } else if (this.selectedCategory == "No-Go Sites") {
        return this.items.filter(
          data => data.is_dead != 1 && data.status != "Site Activated"
        );
      } else if (this.selectedCategory == "Activated Sites") {
        return this.items.filter(data => data.status == "Site Activated");
      } else if (this.selectedCategory == "Survey Requested Sites") {
        return this.items.filter(
          data => data.status == "Site Survey Requested"
        );
      } else if (this.selectedCategory == "Payment Made Sites") {
        return this.items.filter(data => data.status == "Site Payment Made");
      } else if (this.selectedCategory == "Survey Completed Sites") {
        return this.items.filter(
          data => data.status == "Site Survey Completed"
        );
      } else if (this.selectedCategory == "EthioTel Provisioned Sites") {
        return this.items.filter(
          data => data.status == "Ethio Telecom Provision"
        );
      } else if (this.selectedCategory == "Configured Sites") {
        return this.items.filter(data => data.status == "Site Configuration");
      } else if (this.selectedCategory == "Identified Sites") {
        return this.items.filter(data => data.status == "Site Identified");
      } else
        return this.items.filter(
          data => data.status != "Site Activated" && data.is_dead == 1
        );
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Site Name",
          align: "left",
          value: "name",
          ascending: "true"
        },
        { text: "Site Location", value: "location" },
        { text: "Recent Site Status", value: "stat_id" },
        { text: "Time Elapsed", value: "", sortable: false }
      ],
      pagination: {
        sortBy: "stat_id"
      },
      selects: [
        "All Sites",
        "Identified Sites",
        "Activated Sites",
        "No-Go Sites",
        "Survey Requested Sites",
        "Payment Made Sites",
        "Survey Completed Sites",
        "EthioTel Provisioned Sites",
        "Configured Sites"
      ],
      rows_per_page_items: [
        10,
        25,
        5,
        { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }
      ],
      dialog: false,
      edit_Dialog: false,
      na: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      saveProgressHidden: true,
      items: [],
      files: "",
      siteStat: "",
      selectedCategory: "All Sites",
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
      rules: {
        nameRules: [
          value =>
            (value.length > 0 && value.length <= 40) ||
            "Site name must not empty or no more than 20 characters"
        ],
        locationRules: [
          value => value.length > 0 || "Site Location must not empty"
        ],
        latRules: [
          value =>
            (value.length > 0 && parseInt(value) > 0) ||
            "Latitude value can't be less than zero or empty"
        ],
        descriptionRules: [
          value => value.length > 0 || "Site Description must not empty"
        ]
      },
      marketingForm: {
        potential: 0,
        is_feasible: "",
        description: "",
        blocks: 0,
        units: 0,
        business: 0,
        duct: "",
        density: 0,
        mobile: "",
        rental: 0,
        ftth: 0,
        occupancy: 0
      },
      curMar: {},
      currentModalSite: {},
      site: {
        activation_date: null,
        created_at: "",
        description: "",
        ethio_telecom_pro_date: null,
        is_dead: "1",
        latitude: "",
        location: "",
        longitude: "",
        market_analysis_done: "1",
        msag_id: null,
        name: "",
        olt_id: null,
        payment_processed_date: null,
        site_configuration_date: null,
        site_id: "",
        status: "",
        survey_completed_date: null,
        survey_request_date: null,
        ucrm_id: null,
        unms_id: null,
        updated_at: ""
      }
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
          return moment
            .duration(moment(siteinfo.activation_date).diff(moment(new Date())))
            .humanize(true)
            .replace("ago", "");
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
      console.log("clicked");
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
        console.log("duct", this.marketingForm.is_feasible);
        formData.append("name", site.name);
        formData.append("potential", this.marketingForm.potential);
        formData.append("blocks", this.marketingForm.blocks);
        formData.append("units", this.marketingForm.units);
        formData.append("business", this.marketingForm.business);
        formData.append("mobile", this.marketingForm.mobile);
        formData.append("density", this.marketingForm.density);
        formData.append("rental", this.marketingForm.rental);
        formData.append("duct", this.marketingForm.duct == true ? 1 : 0);

        formData.append("occupancy", this.marketingForm.occupancy);
        formData.append("ftth", this.marketingForm.ftth);
        formData.append(
          "is_feasible",
          this.marketingForm.is_feasible == true ? 1 : 0
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
          this.snaackbar_message = "Marketing analysis completed Succesfully";
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
    async openDialog(site, na = false) {
      this.currentModalSite = site;
      let { data } = await this.$axios.post("get_market_analysis/" + site.name);
      this.na = na;
      if (data.length == 1) {
        this.marketingForm.potential = data[0].no_potential_customers;
        this.marketingForm.is_feasible = data[0].is_feasible;
        this.marketingForm.description = data[0].description;
        this.marketingForm.blocks = data[0].blocks;
        this.marketingForm.units = data[0].units;
        this.marketingForm.business = data[0].business;
        this.marketingForm.duct = data[0].duct;
        this.marketingForm.density = data[0].density;
        this.marketingForm.mobile = data[0].mobile;
        this.marketingForm.rental = data[0].rental;
        this.marketingForm.ftth = data[0].ftth;
        this.marketingForm.occupancy = data[0].occupancy;
      }
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
        description: "",
        blocks: 0,
        units: 0,
        business: 0,
        duct: "",
        density: 0,
        mobile: "",
        rental: 0,
        ftth: 0,
        occupancy: 0
      };
      this.dialog = false;
    },
    checkAuthorization(site) {
      let authorizationResult = false;
      if (this.loggedInUser.organization === "EthioTel") {
        authorizationResult = false;
      } else {
        authorizationResult = true;
      }
      return authorizationResult;
    },
    buttonAuth(site, button_type = "update") {
      let auth_result = true;
      if (this.loggedInUser.role == "admin") {
        switch (button_type) {
          case "update":
            site.market_analysis_done != 1 || site.is_dead == 0
              ? (auth_result = false)
              : (auth_result = true);
            break;
          case "mark":
            auth_result = true;
            break;
          default:
            auth_result = false;
            break;
        }
      } else if (this.loggedInUser.role == "Marketing") {
        switch (button_type) {
          case "update":
            auth_result = false;
            break;
          case "mark":
            auth_result = true;
            break;
          default:
            auth_result = false;
            break;
        }
      } else if (this.loggedInUser.role == "Deployment") {
        site.market_analysis_done != 1
          ? (auth_result = false)
          : (auth_result = true);
      }
      return auth_result;
    },
    getStatusColor(siteStatus) {
      let status_color = "pink darken-2";
      switch (siteStatus) {
        case "Site Identified":
          status_color = "red darken-4";
          break;
        case "Site Survey Requested":
          status_color = "lime darken-2";
          break;
        case "Site Survey Completed":
          status_color = "deep-purple";
          break;
        case "Site Payment Made":
          status_color = "cyan darken-2";
          break;
        case "Ethio Telecom Provision":
          status_color = "amber darken-2";
          break;
        case "Site Configuration":
          status_color = "blue-grey darken-2";
          break;
        case "Site Activated":
          status_color = "teal darken-2";
          break;
        default:
          break;
      }
      return status_color;
    },
    editSiteDialog(site) {
      this.site = site;
      this.edit_Dialog = true;
    },
    async submitEditedFiles() {
      if (this.$refs.editSite.validate()) {
        console.log(this.site);
        let formdata = new FormData();
        formdata.append("name", this.site.name);
        formdata.append("location", this.site.location);
        formdata.append("latitude", this.site.latitude);
        formdata.append("longitude", this.site.longitude);
        formdata.append("is_dead", this.site.is_dead == true ? 1 : 0);
        formdata.append("description", this.site.description);
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          formdata.append("files[" + i + "]", file);
        }
        this.saveProgressHidden = false;
        try {
          await this.$axios.post(
            "/update_site/" + this.site.site_id,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );
          this.snaackbar_message = "Site Updated Succesfully";
          this.snackbar_type = "success";
          this.snackbar = true;
          this.edit_Dialog = false;
        } catch (e) {
          this.snaackbar_message = "There was some error";
          this.snackbar_type = "error";
          this.snackbar = true;
          console.log(e);
        }
      }
    }
  }
};
</script>

