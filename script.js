// 🏎️ BOX BOX v0.2
// Earn. Save. Race.


const hourlyRate = 70;
const targetFund = 20000;

const perSecond = hourlyRate / 3600;


let totalFund =
Number(localStorage.getItem("boxboxFund")) || 0;


let records =
JSON.parse(
    localStorage.getItem("boxboxRecords")
)
|| [];



let todayEarned = 0;
let timer = null;
let lunchMode = false;
let bonusMode = false;
let bonusStart = null;
document
.getElementById("bonusBtn")
.onclick=function(){


if(!timer)
return;


bonusMode = true;


bonusStart =
new Date();



document
.getElementById("status")
.innerText =
"🔥 飛馳圈 Bonus";


document
.getElementById("scheduleStatus")
.innerText =
"Extra Push Mode";


};
let startTime = null;
// 📋 Work Records

let workRecords =
JSON.parse(
localStorage.getItem("workRecords")
)
||
[];

let workStartTime = null;
let sessionSeconds = 0;



function getDate(){

    return new Date()
    .toISOString()
    .split("T")[0];

}




function updateDisplay(){


    let current =
    totalFund + todayEarned;


    document.getElementById(
        "todayMoney"
    ).innerText =
    "HK$" + todayEarned.toFixed(2);



    document.getElementById(
        "totalFund"
    ).innerText =
    "HK$" + current.toFixed(2);



    let percent =
    Math.min(
        current / targetFund * 100,
        100
    );


    document.getElementById(
        "progressBar"
    ).style.width =
    percent + "%";



    document.getElementById(
        "progressText"
    ).innerText =
    percent.toFixed(1)
    +
    "% / HK$20,000";



    updateStats();

}





function updateStats(){


let today =
getDate();


let todayMoney =
0;

let weekMoney =
0;

let monthMoney =
0;

let hours = 0;



records.forEach(record=>{


    if(record.date === today){

        todayMoney += record.money;

    }


    let recordDate =
    new Date(record.date);


    let now =
    new Date();



    let diff =
    (now-recordDate)
    /
    (1000*60*60*24);



    if(diff <= 7){

        weekMoney += record.money;

    }



    if(
        recordDate.getMonth()
        ===
        now.getMonth()
    ){

        monthMoney += record.money;

    }


    hours += record.seconds / 3600;



});



document.getElementById(
"todayStat"
).innerText =
"HK$"+todayMoney.toFixed(2);



document.getElementById(
"weekStat"
).innerText =
"HK$"+weekMoney.toFixed(2);



document.getElementById(
"monthStat"
).innerText =
"HK$"+monthMoney.toFixed(2);



document.getElementById(
"workHours"
).innerText =
hours.toFixed(1)
+
" 小時";



document.getElementById(
"sessions"
).innerText =
records.length
+
" 次";

}





function updateTime(){


if(!startTime)
return;



let seconds =
Math.floor(
(Date.now()-startTime)
/1000
);



sessionSeconds = seconds;



let h =
Math.floor(seconds/3600);


let m =
Math.floor(
(seconds%3600)/60
);


let s =
seconds%60;



document.getElementById(
"time"
).innerText =

String(h).padStart(2,"0")
+
":"
+
String(m).padStart(2,"0")
+
":"
+
String(s).padStart(2,"0");

}





document
.getElementById("startBtn")
.onclick=function(){


if(timer)
return;



startTime =
Date.now();
workStartTime =
new Date();


document.getElementById(
"status"
).innerText =
"🟢 Working";



timer =
setInterval(()=>{


todayEarned += perSecond;


updateDisplay();

updateTime();



},1000);


};






document
.getElementById("stopBtn")
.onclick=function(){


if(!timer)
return;



clearInterval(timer);

timer=null;



records.push({

date:getDate(),

money:
todayEarned,

seconds:
sessionSeconds


});



totalFund += todayEarned;
let workEndTime =
new Date();
let bonusHours = 0;


if(bonusStart){


bonusHours =

(
workEndTime
-
bonusStart
)

/

1000

/

60

/

60;


}

let hours =
(
workEndTime
-
workStartTime
)
/
1000
/
60
/
60;



let overtime = 0;


// 預計放工時間

let plannedEnd =
localStorage.getItem("workEnd")
||
"20:00";


let plannedHour =
Number(
plannedEnd.split(":")[0]
);



if(
workEndTime.getHours()
>
plannedHour
){

overtime =
workEndTime.getHours()
-
plannedHour;

}



workRecords.push({

date:
new Date()
.toISOString()
.split("T")[0],

start:
workStartTime
.toLocaleTimeString(),

end:
workEndTime
.toLocaleTimeString(),

hours:
Number(hours.toFixed(2)),

overtime:

overtime,
bonus:

Number(
bonusHours.toFixed(2)
),，
money:

Number(
todayEarned.toFixed(2)
)

});



localStorage.setItem(

"workRecords",

JSON.stringify(workRecords)

);


localStorage.setItem(
"boxboxFund",
totalFund
);



localStorage.setItem(
"boxboxRecords",
JSON.stringify(records)
);



todayEarned=0;

sessionSeconds=0;

startTime=null;



document.getElementById(
"status"
).innerText =
"🏁 Chequered Flag";



document.getElementById(
"time"
).innerText =
"00:00:00";



updateDisplay();
document
.getElementById("resetBtn")
.onclick = function(){

    localStorage.removeItem("boxboxFund");

    totalFund = 0;

    todayEarned = 0;


    updateDisplay();


    alert("🔄 BOX BOX Reset Complete");

};

};





updateDisplay();
// 🕒 工作時間偵測


function checkSchedule(){


let now = new Date();


let current =
now.getHours()*60
+
now.getMinutes();



let start =
localStorage.getItem("workStart")
|| "11:00";


let lunch =
localStorage.getItem("lunchStart")
|| "13:00";


let duration =
Number(
localStorage.getItem("lunchDuration")
)
|| 60;


let end =
localStorage.getItem("workEnd")
|| "20:00";



function convert(time){

let parts =
time.split(":");

return Number(parts[0])*60
+
Number(parts[1]);

}



let startMin =
convert(start);


let lunchMin =
convert(lunch);


let endMin =
convert(end);



let status =
document.getElementById("status");


let schedule =
document.getElementById("scheduleStatus");



if(current < startMin){


status.innerText =
"⚪ 未開始";


schedule.innerText =
"距離返工還有 "
+
(startMin-current)
+
" 分鐘";


}


else if(
current >= startMin
&&
current < lunchMin-10
){


status.innerText =
"🟢 Working";


schedule.innerText =
"努力賺取 F1 基金中";


}



else if(
current >= lunchMin-10
&&
current < lunchMin
){


status.innerText =
"🟡 Pit Stop Soon";


schedule.innerText =
"10分鐘內 Lunch";


}



else if(
current >= lunchMin
&&
current < lunchMin+duration
){


status.innerText =
"🍱 Lunch Time";


schedule.innerText =
"休息中，但仲有錢收！";


}



else if(
current >= lunchMin+duration
&&
current < endMin-15
){


status.innerText =
"🟢 Back on Track";


schedule.innerText =
"繼續推進";


}



else if(
current >= endMin-15
&&
current < endMin
){


status.innerText =
"🏁 Final Lap";


schedule.innerText =
"距離收工少於15分鐘";


}



else{


status.innerText =
"🏆 Finished";


schedule.innerText =
"今日 Session 完成";


}



}




setInterval(
checkSchedule,
1000
);


checkSchedule();
// 🍱 Lunch Button


document
.getElementById("lunchBtn")
.onclick=function(){


if(!timer)
return;


lunchMode = true;


document
.getElementById("status")
.innerText =
"🍱 Lunch Time";


document
.getElementById("scheduleStatus")
.innerText =
"休息中，收入繼續累積";


};





// 🏎️ Return Button


document
.getElementById("resumeBtn")
.onclick=function(){


if(!timer)
return;


lunchMode = false;


document
.getElementById("status")
.innerText =
"🟢 Back on Track";


document
.getElementById("scheduleStatus")
.innerText =
"繼續推進 F1 基金";


};
