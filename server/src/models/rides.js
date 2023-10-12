const mongoose = require('mongoose');
const User = require('./user');
const { Schema } = mongoose;



const ridesSchema = new Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref:'User'},
    rider : {type : mongoose.Schema.Types.ObjectId , ref:'User'},
    estPrice: Number,
    finalPrice : Number,
    phoneNumber:Number,
    status : {
      type:String ,
       enum : ['pending','cancelled','rideAccepted'],
       default : 'pending'
      },
    selectedVehicleId :  mongoose.Schema.Types.ObjectId,
    destinationAddress : String,
    pickInputAddress : String,
    priceChangeCount : Number ,
    currentPos : Object,
    currentDestinationPos: Object

  },{
    timestamps:true
  });
const Rides = mongoose.model('Rides', ridesSchema);

module.exports = Rides;