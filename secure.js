
const express = require("express");
const validator = require("validator");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const RE2 = require("re2");
const logger = require("./logger");

const router = express.Router();

router.use((req,res,next)=>{
    logger.addLog("SECURE", req.originalUrl, "PROTECTED");
    res.setHeader("X-Demo-Security","Secure");
    next();
});

router.use(session({
secret:"secure",
resave:false,
saveUninitialized:false,
cookie:{httpOnly:true,sameSite:"strict"}
}));

const limiter=rateLimit({
windowMs:60000,
max:5,
handler:(req,res)=>{
logger.addLog("SECURE",req.originalUrl,"BLOCKED");
res.send("<div style='color:green'>Rate limit blocked attack</div>");
}
});

router.use(limiter);

router.get("/search",(req,res)=>{
res.send("<div style='color:green'>SAFE:"+validator.escape(req.query.q)+"</div>");
});

router.get("/user",(req,res)=>{
res.send("<div style='color:green'>Safe ID:"+validator.escape(req.query.id)+"</div>");
});

router.get("/login",(req,res)=>{
req.session.user="admin";
res.send("<div style='color:green'>Secure Session Created</div>");
});

router.get("/dos",(req,res)=>{
res.send("<div style='color:green'>Request allowed (protected)</div>");
});

router.get("/regex",(req,res)=>{
const re=new RE2("^[a-z]+$");
res.send("<div style='color:green'>Safe:"+re.test(req.query.input)+"</div>");
});

module.exports=router;
