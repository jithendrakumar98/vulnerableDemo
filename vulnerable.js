
const express = require("express");
const { exec } = require("child_process");
const logger = require("./logger");

const router = express.Router();

router.use((req,res,next)=>{
    logger.addLog("VULNERABLE", req.originalUrl, "ALLOWED");
    res.setHeader("X-Demo-Security","Vulnerable");
    next();
});

router.get("/search",(req,res)=>{
    res.send(`<div style='color:red'>VULNERABLE XSS:<br>${req.query.q}</div>`);
});

router.get("/user",(req,res)=>{
    const query="SELECT * FROM users WHERE id="+req.query.id;
    res.send("<div style='color:red'>SQLi Executed: "+query+"</div>");
});

router.get("/ping",(req,res)=>{
    exec("ping -c 1 "+req.query.host,(err,out,errout)=>{
        res.send("<div style='color:red'>"+(out||errout)+"</div>");
    });
});

router.get("/login",(req,res)=>{

res.send(`
<h2>Vulnerable Login</h2>

<script>

// store sensitive token in localStorage
localStorage.setItem("token","I am the Cookie from Local storage");

// BAD PRACTICE: copy localStorage token into cookie
document.cookie="session="+localStorage.getItem("token");

document.write("Token stored in localStorage AND cookie");

</script>
`);

});


router.get("/dos",(req,res)=>{
    const start=Date.now();
    while(Date.now()-start<3000){}
    res.send("<div style='color:red'>Server blocked (DoS)</div>");
});

router.get("/regex",(req,res)=>{
    const re=/^(a+)+$/;
    res.send("<div style='color:red'>Result:"+re.test(req.query.input)+"</div>");
});

module.exports=router;
