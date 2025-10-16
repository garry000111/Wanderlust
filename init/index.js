const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MongoDB = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(()=>{
    console.log("Connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
  await mongoose.connect(MongoDB);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({
    ...obj,
    owner: "68dffb3998bbb02e2027e1db",
  }))
  await Listing.insertMany(initData.data);
  console.log("Data  was initialize");
}
initDB();