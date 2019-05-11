export default function({route,store,redirect}){
    if(!store.getters.isAuthenticated && route.path != "/login"){
        console.log(route.path);
        return redirect('/login')
    }
    if(store.getters.isAuthenticated && route.path == "/login"){
        console.log("Inside logged in path"+route.path);
        return redirect('/')
    }
    if(store.getters.isAuthenticated && store.getters.loggedInUser.role != 'admin'){
        return redirect('/');
    }
    else{
        return redirect('')
    }
}