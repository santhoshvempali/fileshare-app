const mongoose=require("mongoose");
require('dotenv').config()
const URI=process.env.MONGO_CONNECTION_URL

class mongo_cllient{
    // constructor(url,dbname){
    //     this.dbname=dbname;
    //     this.url=url
    // }

    connect(){
        mongoose.connect( "mongodb://localhost:27017/fileshare",{
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const connection=mongoose.connection;

        connection.once("open", () => {
            console.log("Database connected 🥳🥳🥳🥳");
          })
        //   .catch((err) => {
        //     console.log("Connection failed ☹️☹️☹️☹️");
        //   });
    }
}

module.exports=new mongo_cllient();