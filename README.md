# FriendZone
FriendZone is a school assignment that I did in September 2019 for the course Advanced JavaScript 

## Startup 

Before you can start FriendZone you are going to need two API keys. 
One is for opencagedata.com the other one is for mockaroo.com. 

The key for opencagedata can be obtained by anyone for free on their site. 

The mockaroo key should have been given to you if you are an examining teacher in this course, otherwise the mockaroo API should follow the following pattern: 

```
{
	"firstName":"Suki",
	"lastName":"Veillard",
	"country":"Peru",
	"city":"Motupe",
	"email1":"sveillard0@accuweather.com",
	"email2":"sveillard0@imgur.com",
	"phone1":"+51 977 884 2207",
	"phone2":"455 748 3817",
	"timezone":"America/Lima"
}
```

The keys should be placed in a file that has the following path and name: 

`./backend/secrets/SuperSecretAPIKey.js`

The file look like this: 

```
const API_KEY_OCD = /* API KEY FOR OPENCAGEDATA */;
const API_KEY_MOCK = /* API KEY FOR MOCKAROO */; 

module.exports.API_KEY_OCD = API_KEY_OCD; 
module.exports.API_KEY_MOCK = API_KEY_MOCK; 
```


Once the API Keys are in place, go to the root and run the following commands: 

```
npm install

npm start
```

Open a new terminal and run: 

```
cd backend

node index.js
```

Then go to `http://localhost:3000/`


