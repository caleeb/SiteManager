<template>
  <v-container fluid fill-height grid-list-xl>
    <v-layout column align-center justify-center>
      <v-flex>
        <div class="text-xs-center mb-2">
          <v-avatar color="black" size="200px">
            <img src="https://www.websprix.com/img/logo/logo-small.png" alt="Avatar">
          </v-avatar>
        </div>
        <div class="text-xs-center hidde">
          <p class="font-italic text--darken-2 blue-grey--text line-count">WebSprix ONU Lookup</p>
        </div>
        <v-card>
          <v-card-title>
            <div class="flex-grow-1"></div>
            <v-layout row align="center">
              <v-text-field
                @keypress="formSubmit"
                v-model="mac"
                label="Search Mac Addres"
                single-line
                hide-details
              ></v-text-field>
              <v-btn class="ma-2" outlined fab color="black" @click="formSubmit">
                <v-icon color="white">search</v-icon>
              </v-btn>
            </v-layout>
          </v-card-title>
          <v-card-actions v-if="!searchStat">
            <h3 class="red--text center">{{errorText}}</h3>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <v-data-table dark dense :headers="headers" :items="output" class="elevation-10">
          <template v-slot:items="props">
            <td class="text--accent-1">{{ props.item.onu_name }}</td>
            <td>{{ props.item.site_name }}</td>
            <td>{{ props.item.onu_mac }}</td>
            <td>{{ props.item.createdAt}}</td>
            <td>{{ props.item.updatedAt}}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      mac: "",
      headers: [
        {
          text: "Onu Name",
          align: "left",
          value: "onu_name"
        },
        { text: "Site Name", value: "site_name" },
        { text: "Mac Address", value: "onu_mac" },
        { text: "Date Identified", value: "createdAt" },
        { text: "Last Updated", value: "updatedAt" }
      ],
      output: [],
      searchStat: true,
      errorText: ""
    };
  },
  methods: {
    formSubmit(e) {
      console.log(e);
      if (e.type == "keypress" && e.key == "Enter") {
        let cur = this;
        this.searchStat = true;
        cur.searchStat = [];
        cur.output = [];
        this.$axios
          .post("/mac_lookup", {
            mac: this.mac
          })
          .then(function(response) {
            response.data.forEach(element => {
              let x = element.replace(/'/gi, '"');
              let parsed = JSON.parse(x);
              cur.output.push(parsed);
            });
          })
          .catch(function(error) {
            cur.searchStat = false;
            cur.errorText = "Mac address not found";
          });
      } else if (e.type == "click") {
        let cur = this;
        this.searchStat = true;
        cur.output = [];
        cur.searchStat = [];
        this.$axios
          .post("/mac_lookup", {
            mac: this.mac
          })
          .then(function(response) {
            response.data.forEach(element => {
              let x = element.replace(/'/gi, '"');
              let parsed = JSON.parse(x);
              cur.output.push(parsed);
            });
          })
          .catch(function(error) {
            cur.searchStat = false;
            cur.errorText = "Mac address not found";
          });
      }
    }
  }
};
</script>
