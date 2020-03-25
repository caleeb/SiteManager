<template>
  <v-container fluid fill-height grid-list-xl>
    <v-layout align-start justify-center>
      <v-flex xs12 sm8 md4>
        <div class="text-xs-center mb-2">
          <v-avatar color="black" size="200px">
            <img
              src="https://www.websprix.com/img/logo/logo-small.png"
              alt="Avatar"
            />
          </v-avatar>
        </div>
        <div class="text-xs-center hidde">
          <p class="font-italic text--darken-2 blue-grey--text line-count">
            Welcome Websprix's Site management Module
          </p>
          <span>Sign in With You Active Directory Credentials</span>
        </div>
        <v-card class="elevation-10">
          <v-card-text>
            <v-form ref="loginForm">
              <v-text-field
                prepend-icon="email"
                v-model="email"
                name="login"
                label="Email"
                type="email"
                aria-autocomplete="username"
                :rules="rules.emailRules"
              />
              <v-text-field
                prepend-icon="lock"
                name="password"
                v-model="password"
                label="Password"
                id="password"
                type="password"
                :error-messages="loginErrorMessages"
                aria-autocomplete="current-password"
                :rules="rules.passwordRules"
              />
              <div class="text-xs-center">
                <v-progress-circular
                  indeterminate
                  :class="progressIndicatorState"
                  color="orange"
                />
              </div>
              <!-- <v-checkbox
                :label="'Sign in With My Local Account Instead.' + localAcc"
                v-model="localAcc"
              ></v-checkbox> -->
              <v-btn
                class="d-block ml-auto mr-auto orange--text mt-2"
                dark
                @click="login"
                >Login</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },
  middleware: "authenticated",
  layout: "login",
  data() {
    return {
      email: "",
      password: "",
      localAcc: false,
      progressIndicatorState: "hidden-sm-and-up hidden-sm-and-down",
      loginErrorMessages: "",
      rules: {
        emailRules: [
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid email";
          }
        ],
        passwordRules: [
          value =>
            value.length >= 3 || "Password must be at least 6 characters long"
        ]
      }
    };
  },
  methods: {
    async login() {
      if (this.$refs.loginForm.validate()) {
        try {
          this.loginErrorMessages = "";
          this.progressIndicatorState = "";
          await this.$auth.loginWith("local", {
            data: {
              email: this.email,
              password: this.password,
              localAcc: this.localAcc
            }
          });
          this.progressIndicatorState = "hidden-sm-and-up hidden-sm-and-down";
          this.$router.push("/");
        } catch (e) {
          this.progressIndicatorState = "hidden-sm-and-up hidden-sm-and-down";
          this.password = "";
          this.loginErrorMessages = "Incorrect username or password";
        }
      }
    }
  }
};
</script>
