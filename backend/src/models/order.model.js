const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodpartner"
    },
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"food"

    },
    price:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type:String
    },
    status:{
        type:String,
        enum:["Pending","Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
        default:"Pending",
    }

},{
    timestamps:true
})

const orderModel = mongoose.model("order", orderSchema)

module.exports = orderModel