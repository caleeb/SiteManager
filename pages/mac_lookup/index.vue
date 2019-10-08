<template>
  <v-container fluid fill-height grid-list-xl>
    <v-layout align-start justify-center>
      <v-flex xs12 sm8 md4>
        <div class="text-xs-center mb-2">
          <v-avatar color="black" size="200px">
            <img src="https://www.websprix.com/img/logo/logo-small.png" alt="Avatar">
          </v-avatar>
        </div>
        <div class="text-xs-center hidde">
          <p
            class="font-italic text--darken-2 blue-grey--text line-count"
          >WebSprix ONU Lookup</p>
        </div>
        <v-card class="elevation-10">
          <v-card-text>
              <v-text-field
                prepend-icon="email"
                v-model="mac"
              />
              <div class="text-xs-center">
	 <v-progress-circular indeterminate :class="progressIndicatorState" color="orange"/>
              </div>
              <v-btn class="d-block ml-auto mr-auto orange--text mt-2" dark  @click ="formSubmit">Find Corresponding ONU</v-btn>
          </v-card-text>
<v-simple-table dark>
        <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">ONU Name</th>
          <th class="text-left">Site Name</th>
          <th class="text-left">First ARP Entry Created At</th>
          <th class="text-left">ARP Entry Last Updated At</th>
        </tr>
      </thead>
        <tbody>
        <tr v-for="item in output" :key="item.ONU-Name">
          <td>{{ item.ONU-Name }}</td>
          <td>{{ item.Site-Name}}</td>
          <td>{{ item.createdAt}}</td>
          <td>{{ item.updatedAt}}</td>

        </tr>
      </tbody>
    </template>
  </v-simple-table>
         
        </v-card>
          <strong>Output</strong>
          <pre>
              {{output}}
         </pre>
	  </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
data() {
            return {
              mac: '',
              output: [],
              progressIndicatorState: "hidden-sm-and-up hidden-sm-and-down",

            };
        },
methods: {
	formSubmit(e) {
                let cur = this;
                e.preventDefault();
                this.$axios.post('/mac_lookup', {
                    mac: this.mac
                })
                .then(function (response) {
                    cur.output = response.data;
                    //let x = JSON.parse(cur.output[0]);
                    //console.log(x);
		    //cur.output = x;
                    console.log(cur.output);
                })
                .catch(function (error) {
                    cur.output = error;
                });
            },

   async formSubmit2() {
        try {
          this.progressIndicatorState = "";
          this.output = await this.$axios.post("/mac_lookup", {
            data: {
              mac: this.mac
            }
          });
          this.progressIndicatorState = "hidden-sm-and-up hidden-sm-and-down";
        } catch (e) {
          this.progressIndicatorState = "hidden-sm-and-up hidden-sm-and-down";
          this.loginErrorMessages = "Incorrect MAC Address Format";
      }
     }
}}
</script>
