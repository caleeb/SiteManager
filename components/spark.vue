<template>
  <div>
    <v-card class="mt-5 mx-auto" max-width="700">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="#fbe631"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :value="value"
          color="red darken-2"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template class="black--text" v-slot:label="item"> {{ item.value }} </template>
        </v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2">
          Site Identification Projection over the Last Month [ Divided By Weeks
          ]
        </div>
        <div class="subheading font-weight-light grey--text">
          Last Month Performance
        </div>
        <v-divider class="my-2"></v-divider>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    value: [],
    items: [],
    labels: ["4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "A Week Ago"]
  }),
  mounted() {
    this.$axios.post("countweek").then(result => {
      this.items = [...result.data];
      let array = [];
      for (var i = 0; i < this.items.length; i++) {
        array.push(this.items[i]);
      }
      //   console.log(array);
      this.value = array.reverse();
    });
  }
};
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
