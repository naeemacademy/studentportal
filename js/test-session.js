/*====================================================
            NAEEM ACADEMY
            STUDENT PROFILE
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
    const studentId =
        Number(sessionStorage.getItem("studentId"));

    // If no session
    if (!studentId) {

        window.location.replace("index.html");

        return;

    }

    try {

        // Load students
        const response =
            await fetch("data/students.json");

        if (!response.ok) {

            throw new Error("Unable to load student data.");

        }

        const students =
            await response.json();

        // Find logged in student
        student = students.find(function(item){

            return item.id === studentId;

        });

        // Student not found
        if (!student) {

            sessionStorage.clear();

            window.location.replace("index.html");

            return;

        }

        // Display student information
        document.getElementById("studentName").textContent =
            student.name;

        document.getElementById("studentClass").textContent =
            student.class + " - " + student.group;

        // Display profile information
        loadTestSessions();

    }

    catch(error){

        console.error(error);

        alert("Unable to load student data.");

    }

}


/*====================================================
            LOAD TEST SESSIONS
====================================================*/

function loadTestSessions(){

    const sessionSelect =
        document.getElementById("sessionSelect");

    sessionSelect.innerHTML = "";

    const sessions =
        Object.keys(student.testSessions);

    sessions.forEach(function(session){

        const option =
            document.createElement("option");

        option.value = session;

        option.textContent = session;

        sessionSelect.appendChild(option);

    });

    loadSessionTable(sessions[0]);

    sessionSelect.addEventListener("change", function(){

        loadSessionTable(this.value);

    });

}


/*====================================================
            LOAD SESSION TABLE
====================================================*/

function loadSessionTable(sessionName){

    const session =
        student.testSessions[sessionName];

    document.getElementById("sessionDate").textContent =
        session.date;

    const table =
        document.getElementById("sessionTable");

    table.innerHTML = "";

    let totalObtained = 0;
    let totalMarks = 0;

    session.subjects.forEach(function(subject){

        const subjectName = subject[0];
        const obtained = subject[1];
        const total = subject[2];

        const percentage =
            ((obtained / total) * 100).toFixed(1);

        totalObtained += obtained;
        totalMarks += total;

        let grade = "";

        if(percentage >= 90){

            grade = "A+";

        }

        else if(percentage >= 80){

            grade = "A";

        }

        else if(percentage >= 70){

            grade = "B";

        }

        else if(percentage >= 60){

            grade = "C";

        }

        else{

            grade = "F";

        }

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${subjectName}</td>

            <td>${obtained}</td>

            <td>${total}</td>

            <td>${percentage}%</td>

            <td>${grade}</td>

        `;

        table.appendChild(row);

    });

    const overallPercentage =
        ((totalObtained / totalMarks) * 100).toFixed(1);

    let overallGrade = "";

    if(overallPercentage >= 90){

        overallGrade = "A+";

    }

    else if(overallPercentage >= 80){

        overallGrade = "A";

    }

    else if(overallPercentage >= 70){

        overallGrade = "B";

    }

    else if(overallPercentage >= 60){

        overallGrade = "C";

    }

    else{

        overallGrade = "F";

    }

    document.getElementById("overallObtained").textContent =
        totalObtained;

    document.getElementById("overallTotal").textContent =
        totalMarks;

    document.getElementById("overallPercentage").textContent =
        overallPercentage + "%";

    document.getElementById("overallGrade").textContent =
        overallGrade;

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