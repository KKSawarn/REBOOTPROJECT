const express = require('express');
var scheduler = require('node-cron');
const cp = require('child_process');
const moment = require('moment');
const request = require('request');
const app = express();
app.use(express.json());
const port = process.env.PORT || 6010 ;
var proces = {
    content: 'sudo',
    CD: 'cd',
    PM: 'pm2 restart'
}
app.use(express.json());
var responseFromServer = "", jobPbox = null;
var executionDateTimePboxScheduleWeek = null, schedulePboxExecuteStatusWeek = null;
    executionDateTimePboxScheduleDayMonth = null, schedulePboxExecuteStatusOnceDateMonth = null,
    executionDateTimePboxScheduleDateMonth = null, schedulePboxExecuteStatusOnceDayeMonth = null;
///////////////////////////////////////Executenow section /////////////////////////////
app.post('/executenow', (req, res) => {
    var destination = req.body.type;
    destination = destination.toUpperCase();
    var user = req.body.user;
    var password = req.body.password;
    var iP = req.body.ip;
    console.log("Entered destination type ", destination);
    //////////////////////////////////R-Box section///////////////////////////////////////////
    if (destination == 'RBOX') {
            console.log('req.body user  ', user)
            console.log('req.body.password  ', password)
            console.log('req.body.iP', iP);
            request.post('http://' + iP +':3200'+ '/restart', {
                json: {
                    "user": user,
                    "password": password
                }
            }, (error, response, body) => {
                console.log('esponse.statusCode', response.statusCode);
                let responseValue = response.statusCode;
                executeStatusRbox1 = response.statusCode;
                if (responseValue == 200) {
                    console.log("R-Box on I.P."+iP+" is executed successfully  !!!");
                   res.status(200).send("R-Box on I.P."+iP+" is executed successfully  !!!");
                }
                else if (responseValue == 400) {
                    console.log("R-Box on I.P."+ iP+" is not executed successfully  !!!");
                    res.status(400).send("R-Box on I.P. "+iP+ " is not executed successfully !!!");
                } else {
                    console.log("Request for R-Box on " +iP+ " execution not found   !!!");
                   res.status(404).send("Request for R-Box on "+iP+"execution not found  !!!");
                }
                if (error) {
                    console.log(error);
                }
                console.log('statusCode ', res.statusCode);
                console.log('body ', body);
            })
        //////////////////////////////////////////////////Pbox section////////////////
    }
    else if (destination == 'PBOX') {
        console.log("Entered ip ", iP);
        // var child = cp.spawn(proces.content, ["reboot"]);
        var child = cp.spawn('pm2',['restart','ecosystem.config.js','--env', 'production'], {cwd:"/home/padmin/build/pm2_config"});
	child.stdout.on('data', data =>{
		console.log('data', data.toString());
	});
	child.stderr.on('error', error =>{
		console.log('error', error);
	});       
	console.log("P-Box is executed successfully on !!!");
        res.status(200).send("P-Box is executed successfully on !!!");
    }
    else {
        console.log("Request not matched !!!");
        res.status(404).send.json("Request not matched !!!");
    }
});

///////////////////////////////Schedulenow Section /////////////////////////////////////////

app.post('/schedulenow', (req, res) => {
    var destination = req.body.type;
    destination = destination.toUpperCase();
    var date = req.body.date;
    var month = req.body.month;
    var day = req.body.day;
    var execute = req.body.execute;
    console.log("Entered destination type ", destination);
    /////////////////////////////////////////P-BOX Scheduling /////////////////////////

    if (destination == 'SCHEDULEPBOX') {
        let dateMonth = null;
        console.log('date', date);
        console.log('month', month);
        console.log('day', day);
        console.log('execute', execute);
        console.log('day ', day);

        ///////////////////schedulig on fix day of each week in a given month /////////////////////
        if ((date == 0) && ((month > 0) && (month < 13)) && (day != null)) {
          
            dateMonth = month;            
            console.log('dateMonth ', dateMonth);
            let clockTime = '00 51 19';
            console.log('P-Box scheduled on each :', day, 'of each week in a month', month, 'on time :', clockTime);
	    let dateValidate = (clockTime + ' ' + '*' + ' ' + dateMonth + ' ' + day);
            console.log('dateValidate ', dateValidate);
            let executeTime = new Date();
            jobPbox = scheduler.schedule(dateValidate, () => {
            var child = cp.spawn('pm2',['restart','ecosystem.config.js','--env', 'production'], {cwd:"/home/padmin/build/pm2_config"});
	    child.stdout.on('data', data =>{
		console.log('data', data.toString());
	       });
	    child.stderr.on('error', error =>{
		console.log('error', error);
        	});       
          
                console.log("reboot cmd run");
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":"
				 + executeTime.getDay();
                executionDateTimePboxScheduleWeek = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleWeek);
                schedulePboxExecuteStatusWeek = res.statusCode;
            });
            console.log('Reboot request is accepted');
            res.status(200).send('Reboot request is accepted');
        }
        ////////////////////scheduling on fix day of week once in month///////////////////////////
        
        else if ((date == 00) && (month == 0) && (day != null) && (execute == 'once')) {
            console.log('P-Box scheduled on each first ', day, 'of each month');
            console.log('day ', day);
            console.log('month', month);
            let clockTime = '00 21 19';
		console.log("P-Box scheduled on each first ", day, " once  of each month on time :", clockTime );
            let dateValidate = (clockTime + ' ' + '1-27 ' + ' ' + '1-12' + ' ' + day);
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
              
	   
            var child = cp.spawn('pm2',['restart','ecosystem.config.js','--env', 'production'], {cwd:"/home/padmin/build/pm2_config"});
            child.stdout.on('data', data =>{
		console.log('data', data.toString());
            });
	    child.stderr.on('error', error =>{
		console.log('error', error);
	    });       

	  
                let executeTime = new Date();
                let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
                let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":"
				 + executeTime.getDay();
                console.log("reboot cmd run");
                executionDateTimePboxScheduleDayMonth = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleDayMonth);
                schedulePboxExecuteStatusOnceDayMonth = res.statusCode;
            });
            console.log('Reboot request is accepted');
            res.status(200).send('Reboot request is accepted');
        }

        /////////////////////////////Scheduling on fix date of month at fix time once in a month //////////////////////////
        else if ((date > 0) && ((month > 0) && (month < 13)) && (day == 0)) {
            console.log('date ', date);
            console.log('month', month);
            let executeTime = new Date();
            let clockTime = '00 25 19';
	    console.log("P-Box is scheduled on ", date ," of each month at time  ",clockTime );
            let executionDate = executeTime.getFullYear() + '-' + (executeTime.getMonth() + 1) + '-' + executeTime.getDate();
            let executionTime = executeTime.getHours() + ":" + executeTime.getMinutes() + ":" + executeTime.getSeconds() + ":"
			 + executeTime.getDay();
            let dateValidate = (clockTime + ' ' + ' ' + date + ' ' + month + '-12 ' + '*');
            console.log('dateValidate ', dateValidate);
            jobPbox = scheduler.schedule(dateValidate, () => {
            
           


            var child = cp.spawn('pm2',['restart','ecosystem.config.js','--env', 'production'], {cwd:"/home/padmin/build/pm2_config"});
            child.stdout.on('data', data =>{
		console.log('data', data.toString());
            });
            child.stderr.on('error', error =>{
	        	console.log('error', error);
            });       
	    //    console.log("reboot cmd run");
                executionDateTimePboxScheduleDayMonth = executionDate + ' ' + executionTime;
                console.log('Execution time: ', executionDateTimePboxScheduleDayMonth);
                schedulePboxExecuteStatusOnceDateMonth = res.statusCode;
            });
            console.log('Reboot request is accepted');
            res.status(200).send('Reboot request is accepted')
        }
        else {
        console.log('Please check entered date and time value');
        res.status(404).send('Please check entered date and time value');
    }



} else if (destination == 'STOPPBOX') {
    if (jobPbox != null) {
        jobPbox.stop();
        jobPbox = null;
        console.log('Schedule job for P-Box is stopped successfully');
        res.status(200).send('Schedule job for P-Box is stopped successfully');
    } else {
        console.log('Schedule job for P-Box is not found');
        res.status(200).send('Schedule job for P-Box is not found');
    }
}
else {
    console.log("Request not matched !!!");
    res.status(404).send("Request not matched !!!");
}
});

//////////////////////////////////////////////////RETRIVE SECTION////////////////////////////////

// app.post('/retrivenow', (req, res) => {
//     var responseFromServerExecutStatus = null;
//     var destination = req.body.type;
//     destination = destination.toUpperCase();
//     var iP = req.body.ip;
//     var access = req.body.access;
//     access = access.toUpperCase();
//     ////////R-Box Retrive section/////////////////////////////////////////////////////
//     if (destination == 'RBOX') {
//         if (iP == '172.16.50.243') {
//             if (executeStatusRbox1 == 200) {
//                 console.log('executeStatusiP', executeStatusRbox1)
//                 responseFromServerExecutStatus = "Execution of R-Box found on machine " + iP + " successfull on" +executionDateTimeRbox1;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else if (executeStatusRbox1 == 404) {
//                 responseFromServerExecutStatus = "Execution of R-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimeRbox1;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else {
//                 console.log(executeStatusRbox1);
//                 responseFromServerExecutStatus = "R-Box did not get request for execution !!!";
//                 console.log(responseFromServerExecutStatus);
//             }
//         } else if (iP == '172.14.33.256') {
//             if (executeStatusRbox2 == 200) {
//                 console.log('executeStatusiP', executeStatusRbox2)
//                 responseFromServerExecutStatus = "Execution of R-Box found on machine " + iP + " successfull on" +executionDateTimeRbox2;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else if (executeStatusRbox2 == 404) {
//                 responseFromServerExecutStatus = "Execution of R-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimeRbox2;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else {
//                 console.log(executeStatusRbox2);
//                 responseFromServerExecutStatus = "R-Box did not get request for execution !!!";
//                 console.log(responseFromServerExecutStatus);
//             }
//         }
//         ////////////////////P-Box Retrive section/////////////////////////////////////////
//     }else if(destination == 'PBOX'){
//         if (iP == '172.16.50.171') {
//             if (executeStatusPbox == 200) {
//                 responseFromServerExecutStatus = "Execution of P-Box found on machine " + iP + " successfull on" +executionDateTimePbox;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else if (executeStatusPbox == 404) {
//                 responseFromServerExecutStatus = "Execution of P-Box found doesn't found on machine" + iP + "successfull on" +executionDateTimePbox;
//                 console.log(responseFromServerExecutStatus);
//             }
//             else {
//                 console.log(executeStatusPbox);
//                 responseFromServerExecutStatus = "P-Box did not get request for execution !!!";
//                 console.log(responseFromServerExecutStatus);
//             }
//         }else{
//             console.log("week ")
//             responseFromServerExecutStatus = "Wrong I.P. for P-Box request";
//             console.log(responseFromServerExecutStatus);
//         }  
//     }else if(destination == 'SCHEDULEPBOX'){
//         console.log("week ")
//         //////////////////////////retrivr schedling fix day of week once ///////////////////////
//         if(access == 'WEEK'){
//             if(schedulePboxExecuteStatusWeek == 200){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else if(schedulePboxExecuteStatusWeek == 404){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else {
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
//                 console.log(responseFromServerExecutStatus); 
//             }
//         }
//         //////////////////////////retrivr schedling fix day of month once ///////////////////////
//         else if(access =='MONTH'){
//             if(schedulePboxExecuteStatusOnceDayMonth == 200){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else if(schedulePboxExecuteStatusOnceDayMonth == 404){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else {
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
//                 console.log(responseFromServerExecutStatus); 
//             }
//         }
//         //////////////////////////retrivr schedling fix date of month once ///////////////////////
//         else if(access == 'DATE'){
//             if(schedulePboxExecuteStatusOnceDateMonth == 200){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box found successfull on machine successfull on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else if(schedulePboxExecuteStatusOnceDateMonth == 404){
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found successfull on machine on" +executionDateTimePboxScheduleWeek;
//                 console.log(responseFromServerExecutStatus); 
//             }else {
//                 responseFromServerExecutStatus = "Execution of scheduled P-Box not found ";
//                 console.log(responseFromServerExecutStatus); 
//             }
//         }
//     }
//     res.status(200).send(responseFromServerExecutStatus);
// })
//app.listen(port,"192.168.1.111", () => {
app.listen(port,'172.16.50.145', () => {
    console.log("Listing on port number :172.16.50.145 " + port);
});
