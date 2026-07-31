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
let startTime = null;
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


};





updateDisplay();
