const mongoose = require("mongoose");


const connectDatabse =()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true,
       }).then((data)=>{
            console.log(`Mongodb connected with the server: ${data.connection.host}`);
        })
}
module.exports= connectDatabse
