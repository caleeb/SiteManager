<template>
  <v-app light>
    <v-navigation-drawer fixed app dark clipped :value="drawer" mobile-break-point="1240">
      <v-list>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" to="/">
            home
            <v-icon color="#fbe631">home</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-dialog v-model="dialog" fullscreen>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" flat v-if="isAuthenticated && loggedInUser.organization=='Websprix'">
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
                <v-spacer/>
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
                              @change="handleFileUploads()"
                              ref="files"
                              id="files"
                              multiple
                            >
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
          <v-btn flat v-if="isAuthenticated && loggedInUser.role === 'admin'" to="/iam">
            Manage Users
            <v-icon color="#fbe631">supervisor_account</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile>
          <v-btn flat v-if="isAuthenticated" @click="logout">
            Signout
            <v-icon color="#fbe631">person</v-icon>
          </v-btn>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app dark clipped-left dense>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-if="isAuthenticated" to="/">
          home
          <v-icon color="#fbe631">home</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" fullscreen>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" flat v-if="isAuthenticated && loggedInUser.organization=='Websprix'">
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
              <v-spacer/>
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
                            ref="files"
                            id="files"
                            multiple
                          >
                        </v-input>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-btn flat v-if="isAuthenticated" @click="logout">
          Signout
          <v-icon color="#fbe631">person</v-icon>
        </v-btn>
        <v-btn flat v-if="isAuthenticated && loggedInUser.role === 'admin'" to="/iam">
          Manage Users
          <v-icon color="#fbe631">supervisor_account</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt/>
        <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
          {{snaackbar_message}}
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
    ...mapGetters(["loggedInUser", "isAuthenticated"])
  },
  data() {
    return {
      title: "Site Manager",
      dialog: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      saveProgressHidden: true,
      siteform: {
        potential: "",
        location: "",
        siteName: "",
        lat: "",
        long: "",
        description: "",
        siteStat: "Site Identified",
        files: ""
      },
      rules: {
        nameRules: [
          value =>
            (value.length > 0) ||
            "Site name must not empty"
        ],
        locationRules: [
          value =>
            (value.length > 0) ||
            "Site Location must not empty"
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
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    },
    async submitFiles() {
      if (this.$refs.siteForm.validate()) {
        let formdata = new FormData();
        formdata.append("name", this.siteform.siteName);
        formdata.append("location", this.siteform.location);
        formdata.append("latitude", this.siteform.lat);
        formdata.append("longitude", this.siteform.long);
        formdata.append("status", this.siteform.siteStat);
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
      this.siteform.files = this.$refs.files.files;
    }
  }
};
</script>
