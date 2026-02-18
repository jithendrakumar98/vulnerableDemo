
const express=require("express");
const vulnerable=require("./vulnerable");
const secure=require("./secure");
const logger=require("./logger");
const path=require("path");

const app=express();
let stolenCookies=[];

app.get("/steal",(req,res)=>{

stolenCookies.push(
"Stolen Cookie: "+req.query.cookie+
" Time: "+new Date().toISOString()
);

res.send("cookie stolen");

});


app.get("/attacker",(req,res)=>{

res.json(stolenCookies);

});

app.use("/vulnerable",vulnerable);
app.use("/secure",secure);

app.get("/logs",(req,res)=>{
res.json(logger.getLogs());
});

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(3000,()=>console.log("Updated!"));

