const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
      from:{
        type:String,
        required: true
      },
      to:{
        type:String
      },
      msg:{
        type:String,
        required: true,
        maxLength: 50
      },
      created_at: {
        type:Date,
        required: true
      },
      updated_at:{
        type:Date
      }
})

const Chat = new mongoose.model("Chat",chatSchema)

module.exports = Chat;