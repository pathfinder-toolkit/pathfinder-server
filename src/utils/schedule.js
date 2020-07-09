const schedule = require('node-schedule');

const {
    clearDirectoryWithInterval
} = require("./cleanup");

//every day at 1am we clean the temp files
const cleanUpSchedule = '0 1 * * *';
schedule.scheduleJob(cleanUpSchedule,function(){
    console.log('running scheduled job: clean up tmp files')
    clearDirectoryWithInterval(3.6e+6);
});

