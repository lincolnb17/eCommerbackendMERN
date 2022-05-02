const app = require("./src/app");
const dotenv =require("dotenv");
const connectDatabse = require("./src/config/database");

//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down server due uncaught exceptions`);
    server.close(()=>{
        process.exit(1);
    })

})

//config
dotenv.config({path:"src/config/config.env"})

//connecting database
connectDatabse();


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

//Unhandled Promise Rejections
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down server due unhandled promise rejections`);
    server.close(()=>{
        process.exit(1);
    })

})