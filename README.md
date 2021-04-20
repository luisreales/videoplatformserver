# Getting Started with this project of Video Platform Assessment



## Configure server of node, in the parent folder run : npm install

npm install

### add .env file 

Add these configuration in the .env file

PORT= 3500
MONGODB_HOST = "dbUserTestUnivision"
MONGODB_CLUSTER = "cluster0.ezm82.mongodb.net"
MONGODB_PWD = "pwd123univision*"
MONGODB_DB = "dbUserTestUnivision"
MONGODB_DATABASE = "univision_videos"


### run mode dev , npm run dev ,is the same of  execute node src/server.js 


### enter the folder client, these folder have the frontend build in React

execute npm install

### configure the variables.js file in the folder client

Define the PORT of the Backend in this case is 3500 for the backend.
/src/Util/variables.js

### execute to run

npm start


### execute test coverage 

npm test -- --coverage