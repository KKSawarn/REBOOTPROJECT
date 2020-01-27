const express = require('express');
const cp = require('child_process');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT ||  3200 ;
var proces ={
    content : 'sudo'
}
app.use(express.json());
app.post('/restart', (req,res)=>{
    console.log("receive request");
    var User = JSON.stringify(req.body.user);
    var Password = JSON.stringify(req.body.password);
    console.log('user :' +User)
    console.log('password ' +Password)


    var child = cp.spawn('forever',['restartall'])
    //console.log('IP '+ ip);
    //var child = cp.spawn(proces.content, ["reboot"]);
    res.status(200).send("Accepted !!!");

    req.on('error', error =>{
        console.log(error);
    });
})


app.listen(port,'172.16.50.160', ()=>{
    console.log("Listing on port number :" + port);
    
});
