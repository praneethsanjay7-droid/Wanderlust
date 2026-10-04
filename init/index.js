const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");

async function  main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(console.log("connected to db")).catch((err)=>console.log(err));

const initDb= async ()=>{
    await Listing.deleteMany();
   initData.data= initData.data.map((obj)=> ({...obj,owner:"6a99c40ba1859b595653980c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised ");
}
initDb();