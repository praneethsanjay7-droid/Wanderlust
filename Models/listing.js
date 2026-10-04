const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");
const User=require("./user");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
        default:"https://unsplash.com/photos/person-in-swimming-pool-during-daytime-rlwE8f8anOc"
    },
    description:String,
    image:{
        type:String,
        filename:String
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
      
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    category:{
        type:String,
        enum:["mountains","farms","beaches","arctic","deserts","forests","countryside","lakes","rivers","waterfalls","caves","islands"],
    }
    }
});

//------we are creating a post delete middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})

    }
})

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;