/*====================================================
            NAEEM ACADEMY
        STUDENT ATTENDANCE
====================================================*/

/*====================================================
            GLOBAL VARIABLES
====================================================*/

let student = null;


/*====================================================
            LOAD STUDENT
====================================================*/

async function loadStudent() {

    // Get logged in student ID
    const studentId = Number(sessionStorage.getItem("studentId"));

    // If no session exists
    if (!studentId) {

        window.location.replace("index.html");

        return;

    }

    try {

        // Load students
        const response = await fetch("data/students.json");

        if (!response.ok) {

            throw new Error("Unable to load student data.");

        }

        const students = await response.json();

        // Find logged in student
        student = students.find(function(item){

            return item.id === studentId;

        });

        // If student not found
        if(!student){

            sessionStorage.clear();

            window.location.replace("index.html");

            return;

        }

        // Display student information
        document.getElementById("studentName").textContent =
            student.name;

        document.getElementById("studentClass").textContent =
            student.class + " - " + student.group;

        // Next Step
        loadMonths();

    }

    catch(error){

        console.error(error);

        alert("Unable to load student data.");

    }

}


/*====================================================
            LOAD MONTHS
====================================================*/

function loadMonths(){

    const monthSelect = document.getElementById("monthSelect");

    // Clear previous options
    monthSelect.innerHTML = "";

    // Get all available months
    const months = Object.keys(student.attendance);

    months.forEach(function(month){

        const option = document.createElement("option");

        option.value = month;

        option.textContent = month;

        monthSelect.appendChild(option);

    });

    // Load first month automatically
    showAttendance(months[0]);

}


/*====================================================
        MONTH CHANGE
====================================================*/

document.getElementById("monthSelect")
.addEventListener("change", function(){

    showAttendance(this.value);

});


/*====================================================
            SHOW ATTENDANCE
====================================================*/

function showAttendance(month){

    /*====================================================
            DAYS IN MONTH
====================================================*/

function getDaysInMonth(month){

    const parts = month.split("-");

    const monthName = parts[0];

    const year = Number(parts[1]);

    const months = {

        January:0,
        February:1,
        March:2,
        April:3,
        May:4,
        June:5,
        July:6,
        August:7,
        September:8,
        October:9,
        November:10,
        December:11

    };

    return new Date(year, months[monthName] + 1, 0).getDate();

}

    const calendar =
        document.getElementById("attendanceCalendar");

    calendar.innerHTML = "";

    const attendance =
        student.attendance[month];

    let present = 0;
    let absent = 0;
    let leave = 0;
    let holiday = 0;

    const totalDays = getDaysInMonth(month);

    // Create day boxes
    for(let day = 1; day <= totalDays; day++){

        const dayKey =
            String(day).padStart(2,"0");

        const status =
            attendance[dayKey];

        const box =
            document.createElement("div");

        box.classList.add("day-box");

        let text = "Not Recorded";

        if(status === "P"){

            box.classList.add("present");

            text = "Present";

            present++;

        }

        else if(status === "A"){

            box.classList.add("absent");

            text = "Absent";

            absent++;

        }

        else if(status === "L"){

            box.classList.add("leave");

            text = "Leave";

            leave++;

        }

        else if(status === "H"){

            box.classList.add("holiday");

            text = "Holiday";

            holiday++;

        }

        else{

            box.classList.add("empty");

        }

        box.innerHTML = `

            <div class="day-number">${day}</div>

            <div class="day-status">${text}</div>

        `;

        calendar.appendChild(box);

    }

    // Update Statistics

    document.getElementById("presentCount").textContent =
        present;

    document.getElementById("absentCount").textContent =
        absent;

    document.getElementById("leaveCount").textContent =
        leave;

    // Attendance Percentage
    const total =
        present + absent + leave;

    const percentage =
        total === 0
        ? 0
        : Math.round((present / total) * 100);

    document.getElementById("overallAttendance").textContent =
        percentage + "%";

}

/*====================================================
                LOGOUT
====================================================*/

document.getElementById("logoutBtn")
.addEventListener("click", logoutStudent);

function logoutStudent(){

    sessionStorage.clear();

    window.location.replace("index.html");

}


/*====================================================
            MOBILE SIDEBAR
====================================================*/

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.querySelector(".sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


menuToggle.addEventListener("click", function(){

    sidebar.classList.add("show");

    sidebarOverlay.classList.add("show");

});


sidebarOverlay.addEventListener("click", function(){

    sidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

});

/*====================================================
                NOTICE POPUP
====================================================*/

const noticeBtn =
    document.getElementById("noticeBtn");

const noticePopup =
    document.getElementById("noticePopup");

const noticeOverlay =
    document.getElementById("noticeOverlay");

const closeNotice =
    document.getElementById("closeNotice");

const noticeTitle =
    document.getElementById("noticeTitle");

const noticeDate =
    document.getElementById("noticeDate");

const noticeMessage =
    document.getElementById("noticeMessage");

const noticeDot =
    document.getElementById("noticeDot");

/*====================================================
                LOAD NOTICE
====================================================*/

async function loadNotice(){

    try{

        const response =
            await fetch("data/notice.json");

        if(!response.ok){

            throw new Error("Unable to load notice.");

        }

        const notice =
            await response.json();

        noticeTitle.textContent =
            notice.title;

        noticeDate.textContent =
            notice.date;

        noticeMessage.textContent =
            notice.message;

    }

    catch(error){

        console.error(error);

    }

}

loadNotice();


/*====================================================
            OPEN NOTICE
====================================================*/

noticeBtn.addEventListener("click", function(){

    noticePopup.classList.add("show");

    noticeOverlay.classList.add("show");

    noticeDot.classList.add("hide");

});


/*====================================================
            CLOSE NOTICE
====================================================*/

function closeNoticePopup(){

    noticePopup.classList.remove("show");

    noticeOverlay.classList.remove("show");

}

closeNotice.addEventListener("click", closeNoticePopup);

noticeOverlay.addEventListener("click", closeNoticePopup);

/*==================================================
        EXAMINATION MENU
==================================================*/

const examMenu =
    document.getElementById("examMenu");

const menuGroup =
    document.querySelector(".menu-group");

if(examMenu){

    examMenu.addEventListener("click", function(){

        menuGroup.classList.toggle("open");

    });

}

    /*====================================================
            START PAGE
====================================================*/

loadStudent();