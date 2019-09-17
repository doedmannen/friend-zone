const subs = [];
const store = {
	lang: 'EN',
	dateFormat: 'DD/MM/YYYY',
	timeFormat: '24HOUR'
}; 


store.setState = (changeObject) => {
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

