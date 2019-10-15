<template>
  <v-layout row>
    <v-flex xs12 align-start class="mt-2">
      <v-subheader>All Terminated Clients</v-subheader>
      <v-data-table :headers="headers" dark :items="users" light class="elevation-11">
        <template v-slot:items="props">
          <tr>
            <td>{{ props.item.clientId }}</td>
            <td>{{props.item.activeTo}}</td>
            <td>{{props.item.ip}}</td>
            <td>{{props.item.technician}}</td>
            <td>{{props.item.port == "1" ? "Yes" : "No"}}</td>
            <td>{{props.item.cpe_status}}</td>

            <td>{{props.item.description}}</td>
            <td>
              <!-- <v-btn flat @click="setUser(props.item)">
                <v-icon>edit</v-icon>
              </v-btn>-->
              <v-flex sm2>
                <v-tooltip slot="append" bottom>
                  <v-icon
                    small
                    slot="activator"
                    @click="setUser(props.item)"
                    dark
                    color="teal darken-2"
                  >
                    edit
                    <!-- <v-icon color="black darken-2"></v-icon> -->
                  </v-icon>
                  <span>Update Client</span>
                </v-tooltip>
              </v-flex>
            </td>
            <td>
              <v-flex sm2>
                <v-tooltip slot="append" bottom>
                  <v-icon
                    small
                    slot="activator"
                    @click="openUserCreateDialog(props.item)"
                    dark
                    color="amber darken-2"
                  >
                    info
                    <!-- <v-icon color="black darken-2"></v-icon> -->
                  </v-icon>
                  <span>Latest Remarks</span>
                </v-tooltip>
              </v-flex>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>CPE Update Form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-flex>
            <v-form ref="ChangeUserForm">
              <v-layout column>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Client ID:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box disabled label="Client ID" :value="userForm.clientId"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Client IP Address:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box label="IP Address" disabled :value="userForm.ip"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>CPE Collection Status:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="CPE Status"
                      :value="userForm.cpe_status"
                      v-model="userForm.cpe_status"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>CPE Device Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="Full Name"
                      :value="userForm.technician"
                      v-model="userForm.technician"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-subheader>Is Port Disabled?</v-subheader>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-checkbox label="yes" value="1" v-model="userForm.port"></v-checkbox>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Description:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-textarea
                      box
                      label="Description"
                      :value="userForm.description"
                      v-model="userForm.description"
                    ></v-textarea>
                  </v-flex>
                </v-layout>

                <v-layout row wrap justify-center class="pl-5">
                  <v-flex xs6>
                    <v-btn dark @click="updateClient">Update</v-btn>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-form>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="userDialog" max-width="500px">
      <!-- <v-layout row>
      <v-flex xs12 sm8 offset-sm8>-->
      <v-card>
        <v-card-title>Latest Remarks</v-card-title>
        <v-card-text>
          <v-list two-line>
            <template v-for="(item, index) in single_client">
              <!-- <v-list-tile :key="index" avatar ripple @click="toggle(index)"></v-list-tile> -->
              <div :key="index" class="kygo">
                <v-list-tile-content>
                  <v-list-tile-title class="your_element">
                    <span style="font-weight: bold; color: teal;">{{item.username}}</span>
                    Commented On Client with Name :
                    <span
                      style="font-weight: bold; color: blue; word-break: break-word;"
                    >{{item.technician}}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title
                    class="your_element"
                    style="max-height: 200px"
                    color="teal darken-4"
                  >
                    <strong>Remark Made On: {{item.created_at}}</strong>
                    <br />

                    <span
                      class="scroll-y"
                      style="max-height: 200px; font-weight: bold; word-break: break-word;"
                    >{{item.description}}</span>
                    <hr />
                  </v-list-tile-sub-title>
                  <!-- <v-divider v-if="index + 1 < nots.length"></v-divider> -->
                </v-list-tile-content>
              </div>
            </template>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="userDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
      <!-- </v-flex>
      </v-layout>-->
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
      {{snaackbar_message}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <!-- <v-dialog v-model="userDialog">
      <v-card>
        <v-card-text>
          <v-form ref="UserCreateForm">
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-subheader>Technician Details;</v-subheader>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Client ID:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box disabled label="Client ID" :value="userForm.clientId"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Full Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="Full Name"
                      :value="userForm.technician"
                      v-model="userForm.technician"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-flex xs12 md6 class="ml-auto mr-5">
                  <v-btn color="red" dark @click="assignTech()">Assign Technician</v-btn>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>-->
  </v-layout>
</template>

<script>
export default {
  middleware: "admin_only",
  layout: "site_manager_layout",
  data() {
    return {
      users: [],
      headers: [
        {
          text: "Client ID",
          align: "left",
          value: "clientId"
        },
        { text: "Termination Date", value: "activeTo" },
        { text: "CPE IP Address", value: "ip" },
        { text: "CPE Device Name", value: "technician" },
        { text: "Port Status", value: "status" },
        { text: "CPE Collection Status", value: "cpe_status" },

        { text: "Remark", value: "description" }
      ],
      //   roles: ["admin", "Deployment", "Marketing", "view"],
      //   organizations: ["Websprix", "EthioTel"],
      dialog: false,
      userDialog: false,
      userForm: {
        clientId: "",
        activeTo: "",
        ip: "",
        status: "",
        cpe_status: "",
        technician: "",
        port: "0",
        description: "",
        created_at: null,
        updated_at: null
      },
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      single_client: []
    };
  },
  mounted() {
    this.$axios.post("getTerminated").then(result => {
      this.users = result.data;
    });
  },
  methods: {
    setUser(user) {
      this.userForm = user;
      //   this.userForm.password = "";
      this.dialog = true;
    },
    async updateClient() {
      console.log(this.userForm.description);
      try {
        let { data } = await this.$axios.post(
          "updateClient/" + this.userForm.clientId,
          {
            description: this.userForm.description,
            cpe_status: this.userForm.cpe_status,
            technician: this.userForm.technician,
            port: this.userForm.port == true ? 1 : 0
          }
        );
        this.dialog = false;
        this.snackbar_type = "success";
        this.snaackbar_message = data;
        this.snackbar = true;
      } catch (e) {
        this.snackbar_type = "error";
        this.snaackbar_message = "Unexpected Error please check your data";
        this.snackbar = true;
      }
    },
    openUserCreateDialog(current_client) {
      this.userForm = current_client;
      this.$axios.post("descs/" + this.userForm.clientId).then(result => {
        this.single_client = result.data;
      });
      this.userDialog = true;
    },
    async assignTech() {
      if (this.$refs.UserCreateForm.validate()) {
        try {
          let { data } = await this.$axios.post(
            "assign_technician/" + this.userForm.clientId,
            {
              technician: this.userForm.technician
            }
          );
          this.userDialog = false;
          this.snackbar_type = "success";
          this.snaackbar_message = "User Created successfully";
          this.snackbar = true;
        } catch (e) {
          this.snackbar_type = "error";
          this.snaackbar_message = "Unexpected error; try again later";
          this.snackbar = true;
        }
      }
    }
  }
};
</script>
<style>
.your_element {
  -ms-word-break: break-all;
  word-break: break-all;

  /* Non standard for webkit */
  word-break: break-word;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
.nash {
  word-wrap: break-word; /* All browsers since IE 5.5+ */
  overflow-wrap: break-word; /* Renamed property in CSS3 draft spec */
  width: 100%;
}
</style>