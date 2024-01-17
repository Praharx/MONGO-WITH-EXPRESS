const mongoose = require("mongoose");
const Chat = require("./models/chat.js")

main().then(()=>{
    console.log("Connection is successful");
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

Chat.insertMany([
    {
        from:"Saransh",
        to:"vidya",
        msg:"you prepared for mock",
        created_at: new Date()
    },
    {
        from:"Shreya",
        to:"varansh",
        msg:"you dumbor mock",
        created_at: new Date()
    },
    {
        from:"Dhruv",
        to:"hemant",
        msg:"yk yk yk",
        created_at: new Date()
    },
    {
        from:"Fatima",
        to:"Ramya",
        msg:"I'm don't know",
        created_at: new Date()
    }
])
