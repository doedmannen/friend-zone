import Store from './Store'; 
import User from '../mongo_schema/User';;

async function doAuth(){

	let lang = 'EN', user = null, local = localStorage.getItem('user_id'); 

	if(local){
		user = await User.findOne({ _id: local });
	}

	if(!local){
		lang = navigator.language.search(/...SE/) === 0 ? 'SE' : lang; 
	}


	Store.setState({user, lang});
};

let Auth = function(){
	doAuth();
}

export default Auth;
