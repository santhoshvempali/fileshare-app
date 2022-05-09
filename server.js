const express = require("express");
require('dotenv').config()
const path=require("path")

const PORT=process.env.PORT || 3000

const mongo_cllient=require("./config/db-connection")
mongo_cllient.connect()
const app = express();
app.use(express.static("public"))
app.use(express.json());
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","ejs")
//routes
app.use("/api/files",require("./routes/file"))
app.use("/files",require("./routes/show"))
app.use("/files/download",require("./routes/download"))


try {
  app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`);
  });
} 
catch (err) {
  console.log(`problem in firing up server ${err}`);
}
