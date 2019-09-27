const { API_KEY_OCD, API_KEY_MOCK } = require('./secrets/SuperSecretAPIKey'); 

const fetch = require('node-fetch'); 
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

/*
 * 
 * Define port for express
 *
 * */
const PORT = 5000;




/*
 *
 * Use mongoose to connect to MongoDB
 *
 * */
let dbName = 'friendzone'
mongoose.connect(`mongodb://localhost/${dbName}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/*
 *
 * do note: making db a global variable 
 * available from all files
 *
 * */
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', async () => {
	console.log('Connected to DB');

 /*
  *
  * Do not start express until we 
  * have connection to mongodb
  *
  * */
  startWebServer();
});

/*
 * 
 * Full map of schemas
 * 
 * */
const collectionMap = {
	friend: require('./schema/Friend'),
	user: require('./schema/User'),
	timezone: require('./schema/TimeZone')
}

/*
 * 
 * Strip and collect collection from map
 *
 * */
function getCollection(s) {
	let name = s.replace(/[^a-z]/gi, "").toLowerCase();
	return Object.keys(collectionMap).includes(name) ? collectionMap[name] : null;
}

/*
 * 
 * Strip id
 *
 * */
function stripId(id){
	let keyhold = id.replace(/[^a-f0-9]/gi, "");
	return keyhold.length === 24 ? keyhold : null;
}



/*
 * 
 * Parse query
 *
 * */
function parseQuery(q){
	// TODO should not loop the object and parse, use recursive parsing and check for regexp in query
	let o = {};
	for(let k in q){
		try{
			o[k] = JSON.parse(decodeURIComponent(q[k]));
		} catch(err){	}
	}
	return o; 
}


/*
 *
 * Reconstruct RegExp 
 *
 * */
function reconstructRegExp(rx){
	return new RegExp(
		rx.replace(/^\/(.*)\/\w*$/, '$1'),
		rx.match(/[a-z]*$/i)[0]
	);
}


/*
 *
 * Build friends from mockdata
 *
 * */
async function buildFriends(user){
	let friends; 
	try{
		friends = await ( await fetch(`https://my.api.mockaroo.com/friendzone.json?key=${API_KEY_MOCK}`)).json();
		for(let friend of friends){
			let timeZone = await collectionMap['timezone'].findOne({ name: friend.timezone.replace(/_/gi,' ') }); 
			if(!timeZone) continue; // If timezone didnt match our data jump to the next one  
			let f = new collectionMap['friend']({ 
				firstName: friend.firstName, 
				lastName: friend.lastName,
				country: friend.country,
				city: friend.city,
				phone: [friend.phone1, friend.phone2],
				email: [friend.email1, friend.email2],
				owner: user,
				timeZone
			});
			f.save()
		} 
	}catch(err){
		console.log(err);
	}
}


/*
 *
 * Serve static www
 * 
 * */
app.use(express.static('../build'));

/*
 * 
 * Serve routes API
 * 
 * */

/*
 *
 * Post to backend
 * Used on frontend for creating new object
 *
 * */

app.post('/api/crud/:collection', async (req, res) => {
	let collection = getCollection(req.params.collection);
	
	if(collection){
		let entity = new collection(req.body);
		await entity.save();

		if(collection === collectionMap['user']){
			buildFriends(entity); 
		}

		res.json(entity);
	} else {
		res.status(500);
		res.json({error: "No such collection"});
	}
});


/*
 *
 * Get list of object from mongo based on query
 * Can take extra params for sort, populate etc. 
 * 
 * Used on frontend as findOne by giving distinctFirst=true in query
 *
 * */
app.get('/api/crud/:collection', async (req, res) => {
	let collection = getCollection(req.params.collection), query = parseQuery(req.query);

	if(collection){
		let r = null; 
		r = await collection.find(query.q || {}, null, query.e || {});

		if(r.length){
			if(query.distinctFirst){
				res.json(r[0]);
			} else {
				res.json(r); 
			}
		} else {
			res.status(404);
			res.json(null)
		}
	} else {
		res.status(500);
		res.json({error: "No such collection"});
	}
}); 


/*
 *
 * Not used by frontend project 
 * Used for getting single object by id
 *
 * */
app.get('/api/crud/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		res.json(await collection.findOne({_id: id}))
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}

});

/*
 *
 * Update objects in mongo
 *
 * */
app.put('/api/crud/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		let entity = await collection.findOne({_id: id});
		let replacementBody = req.body;
		Object.assign(entity, replacementBody);
		entity.save();	
		res.json(entity);
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}	
});


/*
 *
 * Takes ObjectId and removes one object with that ObjectId 
 *
 * */
app.delete('/api/crud/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		res.json({ successful: (await collection.deleteOne({_id: id})).n ? true : false })
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}	
});



/*
 *
 * Login route
 *
 * */

app.post('/api/auth', async (req, res) => {

	let password, username, user; 
	if(req.body.username && req.body.password) {
		username = new RegExp(req.body.username ,'gi'); 
		password = req.body.password; 

		user = await collectionMap['user'].findOne({username, password}, {}, {populate: ['friends']});
		if(user){
			res.json({user_id: user._id});
		} else {
			res.status(403);
			res.json({error: 'Failed'})
		}
	} else {
		res.status(403);
		res.json({error: 'Failed'});
	}
});


/*
 *
 * Check if username is taken
 *
 * */

app.get('/api/checkUsername/:username', async (req, res) => {

	let username = new RegExp(`^${req.params.username}$`, 'gi');

	let user = await collectionMap['user'].findOne({ username })

	if(user){
		res.json({isAvailable: false});
	} else {
		res.json({isAvailable: true});
	}

});

/*
 *
 * Check for location timezone
 *
 * */

app.get('/api/getTimeZone/:location', async (req, res) => {

	let r, location = decodeURIComponent(req.params.location);
	
	try{
		r = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${API_KEY_OCD}&language=en&pretty=1`);
		r = await r.json();
		r = r.results[0].annotations.timezone.name.replace(/_/gi, ' ');
		r = await collectionMap['timezone'].findOne({name: r});
	} catch(err){
		r = null; 
	}

	if(r){
		res.json({timeZone: r});
	} else {
		res.status(404); 
		res.json({timeZone: null});
	}

});




/*
 * 
 * Catch any 404 by serving a little tea 
 *
 * */
app.all('*', (req, res) => {
	res.status(418);
	res.send('I\'m a little teapot short and stout\nHere is my handle\nHere is my snout');
});


/*
 *
 * Create webserver 
 * 
 * */
async function startWebServer(){

	/*
	 * If no timezones are found, create them 
	 * */
	console.log("Checking for timezones...")
	let oldTimeZones, TZ = collectionMap['timezone']; 
	try{
		oldTimeZones = await TZ.find({});
	}	catch(err){  }
	if(!oldTimeZones.length){
		console.log('No timezones found. Creating from file...');
		const { zones } = require('./timezones/zones'); 
		for(let zone of zones){
			let insertEntity = new TZ(zone); 
			await insertEntity.save();
		}
		console.log(`Created ${zones.length} timezones from file.`)
	} else {
		console.log(`Found ${oldTimeZones.length} timezones. `)
	}


	/*
	 * 
	 * Start server 
	 *
	 * */
	app.listen(PORT, () => console.log('Listening on port ' + PORT));
}

