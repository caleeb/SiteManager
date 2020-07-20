<template>
  <v-layout justify-center column>
    <v-card>
      <v-toolbar dense class="white">
        <v-toolbar-title>{{client.clientId}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn dark>{{client.status}}</v-btn>
        </v-toolbar-items>
       
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-layout column wrap>
            <v-flex>
              <v-subheader>Recent Site Description</v-subheader>
            </v-flex>
            <v-flex class="text-xs-left pl-3 pt-3 elevation-3">
              <p>{{site.description}}</p>
            </v-flex>
            <v-flex md12>
              <v-divider class="indigo mt-3"></v-divider>
            </v-flex>
            <v-flex>
              <v-layout
                row
                wrap
                justify-start
                class="mt-2"
                v-if="loggedInUser.organization !='EthioTel'"
              >
                <v-subheader>Attached Files</v-subheader>
                <template v-for="item in site.files">
                  <v-flex :key="item.file_id" md1 xs12>
                    <v-tooltip bottom>
                      <template v-slot:activator="{on}">
                        <v-btn
                          v-on="on"
                          dark
                          :href="'https://vispsites.websprix.com/api/getSiteFile/'+item.filename"
                          target="_blank"
                        >
                          file
                          <v-icon color="#fbe631">insert_drive_file</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.filename}}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
              <div class="text-xs-center" v-if="site.files==0">
                <span class="grey--text body-2">No attached files</span>
              </div>
            </v-flex>
            <v-flex md12>
              <v-divider class="indigo mt-3"></v-divider>
            </v-flex>
            <!-- site.market_analysis_done==1 &&  -->
            <v-flex v-if="loggedInUser.organization != 'EthioTel'">
              <v-subheader>Marketing Analysis Report</v-subheader>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <template v-slot:header>
                    <div>Report</div>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-flex>
                        <v-layout row class="elevation-3 pa-2" wrap>
                          <v-flex md6 xs12>
                            <v-subheader>Report Data</v-subheader>
                            <v-layout column>
                              <v-flex>
                                <v-layout row wrap>
                                  <v-flex xs12 md6>
                                    <v-subheader class="black--text">No of Potential Customers</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md6>
                                    <v-text-field
                                      solo
                                      label="Potential Customers"
                                      disabled
                                      :value="marketingReport.no_potential_customers + ' Potential Customers'"
                                    ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-flex>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Is Site Feasible?</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-checkbox disabled :value="1==marketingReport.is_feasible"/>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Is Duct Available?</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-checkbox disabled :value="1==marketingReport.duct"/>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-flex>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Blocks</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.blocks + '\n Blocks'"
                                    />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Units</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.units +' Per Block'"
                                    />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Occupancy Rate</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.occupancy + '\n Houses Occupied'"
                                    />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Mobile Coverage</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field disabled :value="marketingReport.mobile"/>
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Average Rental</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.rental + '\n Birr'"
                                    />
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Suitability for FTTH Rating</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.ftth + ' out of 10.'"
                                    />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md3>
                                    <v-subheader class="black--text">Percentage of Business Units</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field disabled :value="marketingReport.business + '%'"/>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-subheader
                                      class="black--text"
                                    >Average Density - (Units Per Km)</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-text-field
                                      disabled
                                      :value="marketingReport.density + ' units/km.'"
                                    />
                                  </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                  <v-flex xs12 md6>
                                    <v-subheader class="black--text">Marketing Status Description</v-subheader>
                                  </v-flex>
                                  <v-flex xs12 md6>
                                    <v-textarea
                                      solo
                                      label="Description"
                                      disabled
                                      :value="marketingReport.description"
                                    ></v-textarea>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                          <v-flex md6 class="mr-auto" xs12>
                            <v-subheader>Attached Files</v-subheader>
                            <v-layout row wrap>
                              <template v-for="item in marketingReport.files">
                                <v-flex :key="item.file_id" md4 xs12 lg12>
                                  <v-btn
                                    dark
                                    :href="'https://vispsites.websprix.com/api/getMarketFile/'+item.filename"
                                    target="_blank"
                                  >
                                    {{item.filename}}
                                    <v-icon color="#fbe631">insert_drive_file</v-icon>
                                  </v-btn>
                                </v-flex>
                              </template>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-flex md12>
                <v-divider class="indigo mt-3"></v-divider>
              </v-flex>
            </v-flex>
            <v-flex>
              <v-subheader>Site status History</v-subheader>
            </v-flex>
            <v-flex>
              <v-data-table :headers="headers" :items="items" class="elevation-5">
                <template v-slot:items="props">
                  <td class="text-xs-left">{{ calcTimeElapsed(props.item)}}</td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td>{{site.name }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.username }}</td>
                  <td class="text-xs-center">
                    <v-btn
                      dark
                      @click="openModal(props.item,site.site_id,props.item.status)"
                    >view-status</v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-toolbar class="white elevation-12">
          <v-toolbar-side-icon>
            <v-icon @click="closeDialog">close</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>{{'Site name:-'+ site.name+' '}}| {{'Status:- '+ modalSite.status}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-lg fluid>
            <v-layout row wrap>
              <v-flex xs12 md6 class="elevation-3">
                <v-layout column>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex xs12 md4>
                        <v-subheader>Detailed Status Description</v-subheader>
                      </v-flex>
                      <v-flex xs12 md7>
                        <v-textarea box disabled v-model="modalSite.description"></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout row wrap justify-start v-if="loggedInUser.organization !='EthioTel'">
                      <v-subheader>Attached Files</v-subheader>
                      <template v-for="item in modalSite.files">
                        <v-flex :key="item.file_id" md1 xs12>
                          <v-btn
                            dark
                            :href="'https://vispsites.websprix.com/api/getStatusFile/'+item.filename"
                            target="_blank"
                          >
                            {{item.filename}}
                            <v-icon color="#fbe631">insert_drive_file</v-icon>
                          </v-btn>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6 class="elevation-5">
                <v-layout column>
                  <v-flex>
                    <v-form class="elevation-5" v-if="loggedInUser.organization !='EthioTel'">
                      <v-subheader>Post Comment</v-subheader>
                      <v-layout column>
                        <v-flex>
                          <v-layout row wrap>
                            <v-flex md2>
                              <v-subheader>comment</v-subheader>
                            </v-flex>
                            <v-flex md9>
                              <v-textarea box v-model="commentForm.comments"></v-textarea>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex justify-center>
                          <v-layout row wrap>
                            <v-flex xs6 md2>
                              <v-subheader>Flag Comment</v-subheader>
                            </v-flex>
                            <v-flex md6 xs6>
                              <v-checkbox label="WebSprix Only!" v-model="commentForm.flagged"></v-checkbox>
                              <v-btn dark @click.stop="postComments(modalSite.status)">submit</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-flex>
                  <v-flex>
                    <v-subheader>previous Comments</v-subheader>
                    <v-list three-line v-if="comments.length>0">
                      <template v-for="(item) in comments">
                        <v-list-tile :key="item.com_id" class="mt-3">
                          <v-list-tile-avatar
                            color="indigo lighten-2"
                            class="white--text"
                          >{{item.username.charAt(0)}}</v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile
                              style="max-height: 100px"
                              class="scroll-y"
                              v-html="item.comment"
                            ></v-list-tile>
                            <v-list-tile-sub-title v-html="item.username+':-\t'+item.created_at"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </v-list>
                    <v-layout v-else align-center justify-center>
                      <v-flex>
                        <h3 class="body-2 text-xs-left ml-5">no Comments yet</h3>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbar_type" :timeout="timeout" :top="true">
      {{snaackbar_message}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  layout: "site_manager_layout",
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },
  asyncData({ params }) {
    return {
      id: params.id,
      techs: [],
      dialog: false,
      snackbar: false,
      snackbar_type: "primary",
      snaackbar_message: "",
      timeout: 3000,
      saveProgressHidden: true,
      
      headers: [
        { text: "Created At", value: "created_at", sortable: true },
        { text: "Client ID", value: "clientId" },
        {
          text: "Description",
          align: "description",
          sortable: false
        },
        { text: "CPE Collection Status", value: "cpe_status" },
        { text: "Created By", value: "username" },
      ],
    
      descs: [],
      
    };
  },
  mounted() {
    this.$axios.post("technicians/" + this.id).then(result => {
      this.techs = result.data[0];

      this.$axios
        .post("descs/" + this.id)
        .then(data => {
          this.descs = data.data[0];
        });
      // }
    });
  },

  methods: {
    
  }
};
</script>
