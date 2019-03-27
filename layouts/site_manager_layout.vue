<template>
  <v-app light>
    <v-toolbar fixed app dark>
      <v-toolbar-side-icon>
        <v-icon color="orange">web</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-if="isAuthenticated" href="/">
          home
          <v-icon color="orange">home</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" fullscreen>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              flat
              v-if="isAuthenticated && loggedInUser.organization=='Websprix'"
            >newsite
              <v-icon color="orange">add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark>
              <v-toolbar dark>
                <v-toolbar-side-icon>
                  <v-icon @click="dialog = false" color="white">close</v-icon>
                </v-toolbar-side-icon>
                <v-toolbar-title class="white--text">New Site</v-toolbar-title>
                <v-spacer/>
                <v-toolbar-items class="hidden-xs-only">
                  <v-btn flat color="white" @click="submitFiles">save
                    <v-icon>save</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
            </v-toolbar>
            <v-layout row justify-center>
              <v-card-text>
                <v-flex md7>
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
                </v-flex>
              </v-card-text>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-btn flat v-if="isAuthenticated" @click="logout">Signout
          <v-icon color="orange">person</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["loggedInUser", "isAuthenticated"]),
    
  },
  data() {
    return {
      title: "Site Manager",
      dialog: false,
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
            (value.length > 0 && value.length <= 20) ||
            "Site name must not empty or no more than 20 characters"
        ],
        locationRules: [
          value =>
            (value.length > 0 && value.length <= 20) ||
            "Site Location must not empty or no more than 20 characters"
        ],
        latRules: [
          value =>
            (value.length > 0 && parseInt(value) > 0) ||
            "Latitude value can't be less than zero or empty"
        ],
        descriptionRules: [
          value => value.length > 0 || "Site Description must not empty"
        ]
      }
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
        formdata.append("longitude", this.siteform.location);
        formdata.append("status", this.siteform.siteStat);
        formdata.append("description", this.siteform.description);
        for (var i = 0; i < this.siteform.files.length; i++) {
          let file = this.siteform.files[i];
          formdata.append("files[" + i + "]", file);
        }
        try {
          await this.$axios.post("/create_site", formdata, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
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
        } catch (e) {}
      }
    },
    handleFileUploads() {
      this.siteform.files = this.$refs.files.files;
    }
  }
};
</script>
