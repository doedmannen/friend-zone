# FriendZone
FriendZone is a school assignment that I did in September 2019 for the course Advanced JavaScript 


## Startup 

Before you can start FriendZone you are going to need two API keys. 
One is for opencagedata.com the other one is for mockaroo.com. 

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

### `npm install`

### `npm start`

Open a new terminal and run: 

### `cd backend`

### `node index.js`

Then go to `http://localhost:3000/`

