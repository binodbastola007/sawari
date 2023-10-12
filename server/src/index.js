const express = require('express');
const connect = require('./db/connect');
require('dotenv').config();
const userRoute = require('./routes/user');
const Rides = require("./models/rides");
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server ,{
  cors:{
    origin : "*"
  }
});


app.use(cors());

const port = process.env.port;


app.use(express.json())
app.use(userRoute);


connect();

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('rides', async(rides)=>{
    Rides.create(rides);
    const data = await Rides.find({status:'pending'}).sort({'createdAt':-1}).populate("user");
    io.emit("rides",data);
  })
  socket.on('accRide', async(rideInfo)=>{
    await Rides.findByIdAndUpdate(rideInfo.rideId,{
      $set : {status : 'rideAccepted' , rider:rideInfo.riderId}
    })
    const data = await Rides.findById(rideInfo.rideId).populate('rider');
    io.emit("accRide",data);
  })

});

server.listen(port, () => {
  console.log(`Server is running on localhost ${port}`)
})