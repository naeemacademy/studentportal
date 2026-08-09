/*====================================================
            NAEEM ACADEMY
        STUDENT DASHBOARD
====================================================*/

/*====================================================
            SESSION SECURITY
====================================================*/

const studentId = sessionStorage.getItem("studentId");

history.pushState(null, "", location.href);

window.addEventListener("popstate", function(){

    if(!sessionStorage.getItem("studentId")){

        window.location.replace("index.html");

    }

    history.pushState(null, "", location.href);

});

if(!studentId){

    window.location.replace("index.html");

}


/*====================================================
            GLOBAL VARIABLES
====================================================*/

let student = null;

let latestClassTest = null;

let latestTestSession = null;


/*====================================================
            LOAD STUDENT
====================================================*/

loadStudent();

async function loadStudent(){

    try{

        const response = await fetch("data/students.json");

        if(!response.ok){

            throw new Error("Unable to load students.");

        }

        const students = await response.json();

        student = students.find(function(item){

            return item.id == studentId;

        });

        if(!student){

            sessionStorage.clear();

            window.location.replace("index.html");

            return;

        }

        initializeDashboard();

    }

    catch(error){

        console.error(error);

        alert("Unable to load student data.");

    }

}


/*====================================================
        INITIALIZE DASHBOARD
====================================================*/

function initializeDashboard(){

    loadStudentInformation();

    calculateAttendance();

    loadFeeStatus();

    loadLatestClassTest();

    loadLatestTestSession();

    loadLatestExamination();

    loadNotice();

}

/*====================================================
        LOAD STUDENT INFORMATION
====================================================*/

function loadStudentInformation(){

    // Student Name
    document.getElementById("studentName").textContent =
        student.name;

    // Class and Group
    document.getElementById("studentClass").textContent =
        student.class + " - " + student.group;

    // Greeting
    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "Good Morning";

    }
    else if(hour < 17){

        greeting = "Good Afternoon";

    }
    else{

        greeting = "Good Evening";

    }

    document.getElementById("welcomeName").textContent =
        greeting + ", " + student.name;

}

/*====================================================
            CALCULATE ATTENDANCE
====================================================*/

function calculateAttendance(){

    let totalDays = 0;

    let presentDays = 0;

    for(const month in student.attendance){

        const records = student.attendance[month];

        for(const day in records){

            const status = records[day];

            // Ignore Holidays
            if(status === "H"){

                continue;

            }

            totalDays++;

            if(status === "P" || status === "L"){

                presentDays++;

            }

        }

    }

    let percentage = 0;

    if(totalDays > 0){

        percentage = Math.round(
            (presentDays / totalDays) * 100
        );

    }

    document.getElementById("attendancePercentage").textContent =
        percentage + "%";

}

/*====================================================
                LOAD FEE STATUS
====================================================*/

function loadFeeStatus(){

    const feeData = student.fee;

    // Get all months except monthlyFee
    const months = Object.keys(feeData).filter(function(month){

        return month !== "monthlyFee";

    });

    if(months.length === 0){

        document.getElementById("feeStatus").textContent = "N/A";

        return;

    }

    // Latest month
    const latestMonth = months[months.length - 1];

    const status = feeData[latestMonth].status;

    const feeStatus = document.getElementById("feeStatus");

    feeStatus.textContent = status;

    if(status === "Paid"){

        feeStatus.style.color = "#10B981";

    }

    else{

        feeStatus.style.color = "#EF4444";

    }

}

/*====================================================
            LOAD LATEST CLASS TEST
====================================================*/

function loadLatestClassTest(){

    const tests = student.classTests;

    let latestTest = null;

    let latestSubject = "";

    // Search every subject
    for(const subject in tests){

        tests[subject].forEach(function(test){

            if(

                latestTest === null ||

                new Date(test.date) > new Date(latestTest.date)

            ){

                latestTest = test;

                latestSubject = subject;

            }

        });

    }

    if(latestTest === null){

        document.getElementById("latestClassTestName").textContent =
            "No Class Test";

        document.getElementById("latestClassAverage").textContent =
            "--";

        return;

    }

    // Calculate percentage
    const percentage = Math.round(

        (latestTest.obtained / latestTest.total) * 100

    );

    // Save for Latest Examination card
    latestClassTest = {

        name: latestSubject + " - " + latestTest.test,

        percentage: percentage,

        date: latestTest.date

    };

    // Show on Dashboard
    document.getElementById("latestClassTestName").textContent =
        latestClassTest.name;

    document.getElementById("latestClassAverage").textContent =
        percentage + "%";

}

/*====================================================
            LOAD LATEST TEST SESSION
====================================================*/

function loadLatestTestSession(){

    const sessions = student.testSessions;

    let latestSession = null;

    let latestSessionName = "";

    // Find latest session by date
    for(const sessionName in sessions){

        const session = sessions[sessionName];

        if(

            latestSession === null ||

            new Date(session.date) > new Date(latestSession.date)

        ){

            latestSession = session;

            latestSessionName = sessionName;

        }

    }

    if(latestSession === null){

        document.getElementById("latestSessionName").textContent =
            "No Test Session";

        document.getElementById("latestSessionAverage").textContent =
            "--";

        return;

    }

    let obtained = 0;

    let total = 0;

    latestSession.subjects.forEach(function(subject){

        obtained += subject[1];

        total += subject[2];

    });

    const percentage = Math.round(

        (obtained / total) * 100

    );

    // Save for Latest Examination card
    latestTestSession = {

        name: latestSessionName,

        percentage: percentage,

        date: latestSession.date

    };

    // Show on Dashboard
    document.getElementById("latestSessionName").textContent =
        latestSessionName;

    document.getElementById("latestSessionAverage").textContent =
        percentage + "%";

}

/*====================================================
            LOAD LATEST EXAMINATION
====================================================*/

function loadLatestExamination(){

    const examAverage =
        document.getElementById("latestExamAverage");

    const examName =
        document.getElementById("latestExamName");


    // No records available
    if(latestClassTest === null && latestTestSession === null){

        examAverage.textContent = "--";

        examName.textContent = "No Examination Available";

        return;

    }


    // Only Class Test Available
    if(latestTestSession === null){

        examAverage.textContent =
            latestClassTest.percentage + "%";

        examName.textContent =
            latestClassTest.name;

        return;

    }


    // Only Test Session Available
    if(latestClassTest === null){

        examAverage.textContent =
            latestTestSession.percentage + "%";

        examName.textContent =
            latestTestSession.name;

        return;

    }


    // Compare Dates
    if(

        new Date(latestClassTest.date) >

        new Date(latestTestSession.date)

    ){

        examAverage.textContent =
            latestClassTest.percentage + "%";

        examName.textContent =
            latestClassTest.name;

    }

    else{

        examAverage.textContent =
            latestTestSession.percentage + "%";

        examName.textContent =
            latestTestSession.name;

    }

}

/*====================================================
                NOTICE POPUP
====================================================*/

const noticeBtn = document.getElementById("noticeBtn");

const noticePopup = document.getElementById("noticePopup");

const noticeOverlay = document.getElementById("noticeOverlay");

const closeNotice = document.getElementById("closeNotice");

/*====================================================
                NOTICE EVENTS
====================================================*/

noticeBtn.addEventListener("click", function(){

    loadNotice();

});

closeNotice.addEventListener("click", function(){

    closeNoticePopup();

});

noticeOverlay.addEventListener("click", function(){

    closeNoticePopup();

});

/*====================================================
                LOAD NOTICE
====================================================*/

async function loadNotice(){

    try{

        const response = await fetch("data/notice.json");

        if(!response.ok){

            throw new Error("Unable to load notice.");

        }

        const notice = await response.json();

        document.getElementById("noticeTitle").textContent =
            notice.title;

        document.getElementById("noticeDate").textContent =
            notice.date;

        document.getElementById("noticeMessage").textContent =
            notice.message;

        noticePopup.classList.add("show");

        noticeOverlay.classList.add("show");

        document.getElementById("noticeDot").classList.remove("hide");

    }

    catch(error){

        console.error(error);

        alert("Unable to load latest notice.");

    }

}

/*====================================================
                CLOSE NOTICE
====================================================*/

function closeNoticePopup(){

    noticePopup.classList.remove("show");

    noticeOverlay.classList.remove("show");

    document.getElementById("noticeDot").classList.add("hide");

}

/*====================================================
                MOBILE SIDEBAR
====================================================*/

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.querySelector(".sidebar");

const sidebarOverlay = document.getElementById("sidebarOverlay");


menuToggle.addEventListener("click", function(){

    sidebar.classList.add("show");

    sidebarOverlay.classList.add("show");

});


sidebarOverlay.addEventListener("click", function(){

    sidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

});

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
                    LOGOUT
====================================================*/

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function(){

    const confirmLogout = confirm("Are you sure you want to logout?");

    if(!confirmLogout){

        return;

    }

    sessionStorage.clear();

    history.replaceState(null, "", "index.html");

    window.location.replace("index.html");

});