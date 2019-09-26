const subs = [];
const store = {
	authStatus: 'init',
	lang: 'EN',
	dateFormat: 'DD/MM/YYYY',
	timeFormat: '24HOUR', 
	user: null
}; 


store.setState = (changeObject) => {
	if(changeObject['user']){
		let copy = {}; 
		Object.assign(copy, changeObject); 
		changeObject = { user: copy.user, lang: copy.user.lang, dateFormat: copy.user.dateFormat, timeFormat: copy.user.timeFormat }; 
	} 

	Object.assign(store, changeObject);
	
	let sub;
	for(sub of subs){
		sub(changeObject); 
	}
};  

store.subTo = (func) => {
	subs.push(func);
}

store.unSub = (fun) => {
	let index = subs.indexOf(fun); 
	if(index < 0) { return; }
	subs.splice(index, 1); 
}

export default store; 

