<template>
  <v-layout row>
    <v-flex xs12 align-start class="mt-2">
      <v-subheader>All Users</v-subheader>
      <v-data-table :headers="headers" :items="users" light class="elevation-11">
        <template v-slot:items="props">
          <tr>
            <td>{{ props.item.full_name }}</td>
            <td>{{props.item.organization}}</td>
            <td>{{props.item.role}}</td>
            <td>
              <v-btn flat @click="setUser(props.item)">
                <v-icon>edit</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-btn color="#fbe631" dark bottom right fab absolute class="mb-5" @click="openUserCreateDialog">
        <v-icon>add</v-icon>
      </v-btn>
    </v-flex>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>User Update Form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-flex>
            <v-form ref="ChangeUserForm">
              <v-layout column>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Full Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box disabled label="Full Name" :value="userForm.full_name"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Organization:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box label="Organization" disabled :value="userForm.organization"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>User Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field box disabled label="User Name" :value="userForm.username"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Role:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      box
                      :items="roles"
                      label="Role"
                      :value="userForm.role"
                      v-model="userForm.role"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>head Of Department:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-checkbox
                      label="yes"
                      :value="1==userForm.is_admin"
                      v-model="userForm.is_admin"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
                <v-layout row wrap justify-center class="pl-5">
                  <v-flex xs6>
                    <v-btn dark @click="updateUser">Update</v-btn>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-form>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
      {{snaackbar_message}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="userDialog">
      <v-card>
        <v-card-text>
          <v-form ref="UserCreateForm">
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-subheader>User Details;</v-subheader>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Full Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="Full Name"
                      :value="userForm.full_name"
                      v-model="userForm.full_name"
                      :rules="userRules.nameRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Email:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      type="email"
                      label="Email"
                      :value="userForm.email"
                      v-model="userForm.email"
                      :rules="userRules.emailRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Password:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="Password"
                      :value="userForm.password"
                      v-model="userForm.password"
                      :rules="userRules.passwordRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>User Name:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      box
                      label="User Name"
                      :value="userForm.username"
                      v-model="userForm.username"
                      :rules="userRules.nameRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                <v-subheader>Organizational Details;</v-subheader>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Organization:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      box
                      label="Organization"
                      :items="organizations"
                      :value="userForm.organization"
                      v-model="userForm.organization"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>Role:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      box
                      :items="roles"
                      label="Role"
                      :value="userForm.role"
                      v-model="userForm.role"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 md6>
                    <v-subheader>head Of Department:</v-subheader>
                  </v-flex>
                  <v-flex xs6>
                    <v-checkbox
                      label="yes"
                      :value="1==userForm.is_admin"
                      v-model="userForm.is_admin"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          <v-flex xs12 md6 class="ml-auto mr-5">
              <v-btn color="red" dark @click="createUser">Create</v-btn>
            </v-flex>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
          text: "Full Name",
          align: "left",
          value: "full_name"
        },
        { text: "Organization", value: "organization" },
        { text: "User Role", value: "role" }
      ],
      roles: ["admin", "Deployment", "Marketing", "view"],
      organizations: ["Websprix", "EthioTel"],
      dialog: false,
      userDialog: false,
      userForm: {
        id: 1,
        username: "",
        email: "",
        phone: "",
        full_name: "",
        role: "view",
        is_admin: 0,
        organization: "EthioTel",
        created_at: null,
        updated_at: null,
        password: "^nDr0id1x"
      },
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      userRules: {
        emailRules: [
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid email";
          }
        ],
        passwordRules: [
          value =>
            value.length >= 6 || "Password must be at least 6 characters long"
        ],
        nameRules: [value => value.length >= 1 || "Name must not be empty"]
      }
    };
  },
  mounted() {
    this.$axios.post("all_users").then(result => {
      this.users = result.data;
    });
  },
  methods: {
    setUser(user) {
      this.userForm = user;
      this.userForm.password = "";
      this.dialog = true;
    },
    async updateUser() {
      try {
        let { data } = await this.$axios.post(
          "update_user/" + this.userForm.id,
          {
            role: this.userForm.role,
            is_admin: this.userForm.is_admin
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
    openUserCreateDialog() {
      this.userForm = {
        id: 1,
        username: "",
        email: "",
        phone: "",
        full_name: "",
        role: "view",
        is_admin: 0,
        organization: "EthioTel",
        created_at: null,
        updated_at: null,
        password: "^nDr0id1x"
      };
      this.userDialog = true;
    },
    async createUser() {
      if (this.$refs.UserCreateForm.validate()) {
        try {
          let { data } = await this.$axios.post("add_user", {
            username: this.userForm.username,
            full_name: this.userForm.full_name,
            email: this.userForm.email,
            password: this.userForm.password,
            organization: this.userForm.organization,
            role: this.userForm.role,
            is_admin: this.userForm.is_admin
          });
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
