<template>
  <v-container fluid fill-height grid-list-xl>
    <v-layout align-start justify-center>
      <v-flex xs12 sm8 md6>
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
              <v-text-field v-model="mac" label="Search Mac Addres" single-line hide-details></v-text-field>
              <v-btn class="ma-2" outlined fab color="black" @click="formSubmit">
                <v-icon color="white">search</v-icon>
              </v-btn>
            </v-layout>
          </v-card-title>
          <v-card-actions v-if="!searchStat">
            <h3 class="red--text center">{{errorText}}</h3>
          </v-card-actions>
        </v-card>
        <v-data-table dark dense :headers="headers" :items="output" class="elevation-10">
          <template v-slot:items="props">
            <td class="text--accent-1">{{ props.item.onu_name }}</td>
            <td>{{ props.item.site_name }}</td>
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
      let cur = this;
      this.searchStat = true;
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
};
</script>
