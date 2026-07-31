// 🏎️ BOX BOX v0.1
// Earn. Save. Race.


const hourlyRate = 70; 
const targetFund = 20000;


// 每秒收入
const perSecond = hourlyRate / 3600;


// 讀取之前基金
let totalFund =
    Number(
        localStorage.getItem("boxboxFund")
    ) || 0;



let todayEarned = 0;

let timer = null;

let startTime = null;



// 更新畫面

function updateDisplay(){


    // 今日收入

    document.getElementById(
        "todayMoney"
    ).innerText =
        "HK$" +
        todayEarned.toFixed(2);



    // 總基金

    let current =
        totalFund + todayEarned;


    document.getElementById(
        "totalFund"
    ).innerText =
        "HK$" +
        current.toFixed(2);



    // 進度

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


}



// 更新時間

function updateTime(){


    if(!startTime)
        return;



    let seconds =
        Math.floor(
            (Date.now()-startTime)
            /
            1000
        );


    let h =
        Math.floor(
            seconds / 3600
        );


    let m =
        Math.floor(
            (seconds % 3600)
            /
            60
        );


    let s =
        seconds % 60;



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



// 開始工作

document
.getElementById("startBtn")
.onclick = function(){


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




// 收工

document
.getElementById("stopBtn")
.onclick = function(){


    if(!timer)
        return;



    clearInterval(timer);


    timer = null;



    totalFund += todayEarned;



    localStorage.setItem(
        "boxboxFund",
        totalFund
    );



    todayEarned = 0;



    document.getElementById(
        "status"
    ).innerText =
        "🏁 Chequered Flag";



    startTime = null;



    updateDisplay();



    document.getElementById(
        "time"
    ).innerText =
        "00:00:00";



};





// 初始載入

updateDisplay();
