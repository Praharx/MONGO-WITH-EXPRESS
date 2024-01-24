const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require('method-override');
const expressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


main().then(() => {
    console.log("Connection is successful");
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}


//Index Route
app.get("/chats",asyncWrap(async (req, res) => {
    
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    
}));

//New Route
app.get("/chats/new", (req, res) => {
    res.render("newchatform.ejs");

})

app.post("/chats",asyncWrap( async (req, res, next) => {
    
        let { from, msg, to } = req.body
        let newChat = new Chat({
            from: from,
            msg: msg,
            to: to,
            created_at: new Date()
        });
        await newChat.save();
        res.redirect("/chats")
    
}));

//Edit Route
app.get("/chats/:id/edit",asyncWrap(async (req, res) => {
    
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("editform.ejs", { chat });
    
}));

function asyncWrap(fn){
    return (function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
    })
}


app.put("/chats/:id",asyncWrap( async (req, res) => {
    
        let { id } = req.params;
        let { editedmsg } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg: editedmsg, updated_at: new Date() }, { runValidators: true, new: true })
        console.log(updatedChat);
    
}));

//New- Show route
app.get("/chats/:id",asyncWrap( async (req, res, next) => {
    
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            next(new expressError(404, "Abrupt error"));
        }
        res.render("editform.ejs", { chat });
    
}));



//Destroy route
app.delete("/chats/:id",asyncWrap( async (req, res) => {
    
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
   
}));




app.get("/", (req, res) => {
    res.send("Server working well")
})

//error handling middleware
const handleValidErr = (err)=>{
    console.log("Vaidation error!Please follow rules!!");
    console.dir(err.message);
    next(err);
}
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        handleValidErr(err);
    }
    next(err);
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some error!" } = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("app is listening on port 8080");
})