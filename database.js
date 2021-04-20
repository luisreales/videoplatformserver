const mongoose = require("mongoose")

// Read environment variables

const {MONGODB_HOST,MONGODB_CLUSTER,MONGODB_PWD,MONGODB_DB,MONGODB_DATABASE} = process.env;

const mongoString = `mongodb+srv://${MONGODB_HOST}:${MONGODB_PWD}@${MONGODB_CLUSTER}/${MONGODB_DATABASE}`

mongoose.connect(mongoString, {useNewUrlParser: true,useUnifiedTopology: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})