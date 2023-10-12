const mongoose = require('mongoose');
const { Schema } = mongoose;


const adminSchema = new Schema({
    vehicle: String,
    pricePerUnitKm: String,
    
  });
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;