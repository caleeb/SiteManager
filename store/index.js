export const getters = {
    
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
  userGroups(state) {
    let groups = [];
    if (state.auth.user.group.length == 0) return groups;
    state.auth.user.group.forEach(element => {
      let cn = element.split("@")[0].split(".")
      if (element.includes("sman.sman")) {
        cn = cn[2];
      }
      else cn = cn[1];
      // console.log(element, cn);
      groups.push(cn)
    });
    return groups;
  } 
    

}
