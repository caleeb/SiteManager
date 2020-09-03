<template>
  <v-app light>
    <v-navigation-drawer fixed app dark clipped :value="drawer">
      <v-list>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" to="/">
            home
            <v-icon color="#fbe631">home</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile v-if="addSiteAuth()">
          <v-dialog v-model="dialog" fullscreen>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" flat>
                newsite
                <v-icon color="#fbe631">add</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dark>
                <v-toolbar-side-icon>
                  <v-icon @click="dialog = false" color="white">close</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-title class="white--text">New Site</v-toolbar-title>
                <v-spacer />
                <v-toolbar-items class="hidden-xs-only">
                  <v-btn flat color="white" @click="submitFiles">
                    save
                    <v-icon>save</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-progress-linear
                indeterminate
                color="#fbe631"
                height="2"
                :hidden="saveProgressHidden"
              ></v-progress-linear>
              <v-layout row justify-start>
                <v-flex md7>
                  <v-card-text>
                    <v-form ref="siteForm">
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Site Name</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-text-field
                            label="Site Name"
                            outline
                            v-model="siteform.siteName"
                            :rules="rules.nameRules"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Site Status</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-text-field
                            solo
                            v-model="siteform.siteStat"
                            :value="siteform.siteStat"
                            disabled
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Site Location</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-text-field
                            label="Site Location"
                            outline
                            placeholder="general site location"
                            :rules="rules.locationRules"
                            v-model="siteform.location"
                            :value="siteform.siteStat"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Location Latitude</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-text-field
                            type="number"
                            outline
                            label="Latitude"
                            placeholder=" 9.005401"
                            v-model="siteform.lat"
                            :rules="rules.latRules"
                            :value="siteform.siteStat"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Location Longtitude</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-text-field
                            type="number"
                            label="longitude"
                            placeholder="38.763611"
                            outline
                            v-model="siteform.long"
                            :rules="rules.latRules"
                            :value="siteform.siteStat"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6 md6>
                          <v-subheader>Site Type</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-select
                            :items="selects"
                            label="Site Type"
                            v-model="siteform.site_type"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="mt-3">
                        <v-flex xs6 md6>
                          <v-subheader>Site Status Description</v-subheader>
                        </v-flex>
                        <v-flex xs6 md6>
                          <v-textarea
                            box
                            v-model="siteform.description"
                            label="Site status Description"
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
                              @change="drawerFileUploads()"
                              ref="drawerFiles"
                              id="files"
                              multiple
                            />
                          </v-input>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </v-list-tile>
        <v-list-tile>
          <v-btn
            flat
            v-if="isAuthenticated && loggedInUser.role === 'admin'"
            to="/iam"
          >
            Manage Users
            <v-icon color="#fbe631">supervisor_account</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" to="/summary">
            Summary
            <v-icon color="#fbe631">camera</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" to="/ucrmclients">
            CPE Devices
            <v-icon color="#fbe631">camera</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" @click="dialog2 = true">
            <v-badge right>
              <template v-slot:badge>
                <span>{{ new_coms }}</span>
              </template>
              Notifications
              <v-icon color="#fbe631">mail</v-icon>
            </v-badge>
          </v-btn>
        </v-list-tile>
        <v-dialog v-model="dialog2" max-width="500px">
          <!-- <v-layout row>
          <v-flex xs12 sm8 offset-sm8>-->
          <v-card>
            <v-card-title>New Notifications</v-card-title>
            <v-card-text>
              <v-list two-line>
                <template v-for="(item, index) in nots">
                  <!-- <v-list-tile :key="index" avatar ripple @click="toggle(index)"></v-list-tile> -->
                  <a
                    style="text-decoration: none;"
                    :href="'/site/' + item.site_name['0'].site_id"
                    :key="index"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <span style="font-weight: bold; color: teal">{{
                          item.username
                        }}</span>
                        Commented On
                        <span style="font-weight: bold; color: blue">{{
                          item.site_name["0"].name
                        }}</span>
                        on {{ item.status }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title class="text--primary bold"
                        ><span style="font-weight: bold; color: grey darken-4">
                          {{ item.comment["0"].comment }}
                        </span></v-list-tile-sub-title
                      >
                    </v-list-tile-content>
                    <v-divider v-if="index + 1 < nots.length"></v-divider>
                  </a>
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" flat @click="dialog2 = false">Close</v-btn>
            </v-card-actions>
          </v-card>
          <!-- </v-flex>
          </v-layout>-->
        </v-dialog>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" @click="logout">
            Signout
            <v-icon color="#fbe631">person</v-icon>
          </v-btn>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app dark clipped-left dense>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-if="isAuthenticated" to="/">
          home
          <v-icon color="#fbe631">home</v-icon>
        </v-btn>
        <!-- <v-btn flat v-if="isAuthenticated" to="/summary">
          Summary
          <v-icon color="#fbe631">add</v-icon>
        </v-btn> -->
        <v-dialog v-model="dialog" fullscreen v-if="addSiteAuth()">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              flat
              v-if="isAuthenticated && loggedInUser.organization == 'Websprix'"
            >
              newsite
              <v-icon color="#fbe631">add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark fixed>
              <v-toolbar-side-icon>
                <v-icon @click="dialog = false" color="white">close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title class="white--text">New Site</v-toolbar-title>
              <v-spacer />
              <v-toolbar-side-icon @click="submitFiles">
                <span class="hidden-xs-only">save</span>
                <v-icon>save</v-icon>
              </v-toolbar-side-icon>
            </v-toolbar>
            <v-progress-linear
              indeterminate
              color="#fbe631"
              height="2"
              :hidden="saveProgressHidden"
            ></v-progress-linear>
            <v-layout row justify-start class="mt-5">
              <v-flex md7>
                <v-card-text>
                  <v-form ref="siteForm">
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-subheader>Site Name</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          label="Site Name"
                          outline
                          v-model="siteform.siteName"
                          :rules="rules.nameRules"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-subheader>Site Status</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          solo
                          v-model="siteform.siteStat"
                          :value="siteform.siteStat"
                          disabled
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-subheader>Site Location</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          label="Site Location"
                          outline
                          placeholder="general site location"
                          :rules="rules.locationRules"
                          v-model="siteform.location"
                          :value="siteform.siteStat"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-subheader>Location Latitude</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          type="number"
                          outline
                          label="Latitude"
                          placeholder=" 9.005401"
                          v-model="siteform.lat"
                          :rules="rules.latRules"
                          :value="siteform.siteStat"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-subheader>Location Longtitude</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-text-field
                          type="number"
                          label="longitude"
                          placeholder="38.763611"
                          outline
                          v-model="siteform.long"
                          :rules="rules.latRules"
                          :value="siteform.siteStat"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                     <v-layout row wrap>
                        <v-flex xs12 md6>
                          <v-subheader>Site Type</v-subheader>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-select
                            :items="selects"
                            label="Site Type"
                            v-model="siteform.site_type"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    <v-layout row wrap class="mt-3">
                      <v-flex xs12 md6>
                        <v-subheader>Site Status Description</v-subheader>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-textarea
                          box
                          v-model="siteform.description"
                          label="Site status Description"
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
                            ref="siteFormFiles"
                            id="files"
                            multiple
                          />
                        </v-input>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-btn flat v-if="isAuthenticated" to="/summary">
          Summary
          <v-icon color="#fbe631">person</v-icon>
        </v-btn>
        <v-btn flat v-if="isAuthenticated" @click="logout">
          Signout
          <v-icon color="#fbe631">person</v-icon>
        </v-btn>
        <v-btn flat v-if="isAuthenticated" to="/ucrmclients">
          CPE Devices
          <v-icon color="#fbe631">camera</v-icon>
        </v-btn>
        <v-btn
          flat
          v-if="isAuthenticated && loggedInUser.role === 'admin'"
          to="/iam"
        >
          Manage Users
          <v-icon color="#fbe631">supervisor_account</v-icon>
        </v-btn>

        <v-btn flat v-if="isAuthenticated" @click="dialog2 = true">
          <v-badge right>
            <template v-slot:badge>
              <span>{{ new_coms }}</span>
            </template>
            Notifications
            <v-icon color="#fbe631">mail</v-icon>
          </v-badge>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon
        class="hidden-sm-and-up"
        @click="drawer = !drawer"
      ></v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt />
        <v-snackbar
          v-model="snackbar"
          :color="snackbar_type"
          :timeout="timeout"
          :top="true"
        >
          {{ snaackbar_message }}
          <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { async } from "q";

export default {
  computed: {
    ...mapGetters(["loggedInUser", "isAuthenticated", "userGroups"])
  },
  data() {
    return {
      nots: [],
      selects: [
        "General",
        "Condominium",
        "Bus Complex",
        "Real Estate",
        "Housing Agency",
        "Association",
        "Apartment Building"
      ],
      title: "Site Manager",
      dialog: false,
      dialog2: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      new_coms: 0,
      saveProgressHidden: true,
      siteform: {
        potential: "",
        location: "",
        siteName: "",
        lat: "",
        long: "",
        description: "",
        siteStat: "Site Identified",
        files: "",
        site_type: ""
      },
      rules: {
        nameRules: [value => value.length > 0 || "Site name must not empty"],
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
      drawer: false
    };
  },
  mounted() {
    this.$axios.post("get_notification").then(result => {
      this.nots = [...result.data];
      this.new_coms = this.nots.length;
      console.log(this.nots);
    });
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    },
    addSiteAuth() {
      return (
        this.isAuthenticated &&
        (this.loggedInUser.role === "admin" ||
          this.userGroups.includes("add_site"))
      );
    },
    openNotDiag() {
      this.dialog2 = true;
      //    this.$axios.post("update_nots").then(result => {
      //    console.log('seen')
      // });
    },
    async submitFiles() {
      if (this.$refs.siteForm.validate()) {
        let formdata = new FormData();
        formdata.append("name", this.siteform.siteName);
        formdata.append("location", this.siteform.location);
        formdata.append("latitude", this.siteform.lat);
        formdata.append("longitude", this.siteform.long);
        formdata.append("status", this.siteform.siteStat);
        formdata.append("site_type", this.siteform.site_type);
        formdata.append("description", this.siteform.description);
        for (var i = 0; i < this.siteform.files.length; i++) {
          let file = this.siteform.files[i];
          formdata.append("files[" + i + "]", file);
        }
        this.saveProgressHidden = false;
        try {
          await this.$axios.post("/create_site", formdata, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          this.saveProgressHidden = true;
          this.snaackbar_message = "Site created Succesfully";
          this.snackbar_type = "success";
          this.snackbar = true;
          this.siteform = {
            potential: "",
            location: "",
            siteName: "",
            lat: "",
            long: "",
            description: "",
            siteStat: "Site Identified",
            files: ""
          };
          this.dialog = false;
        } catch (e) {
          this.saveProgressHidden = true;
        }
      }
    },
    handleFileUploads() {
      this.siteform.files = this.$refs.siteFormFiles.files;
    },
    drawerFileUploads() {
      this.siteform.files = this.$refs.drawerFiles.files;
    }
  }
};
</script>
