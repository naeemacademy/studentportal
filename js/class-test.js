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
        loadClassTest();

    }

    catch(error){

        console.error(error);

        alert("Unable to load student data.");

    }

}

/*====================================================
            LOAD CLASS TEST
====================================================*/

function loadClassTest(){

    const subjectSelect =
        document.getElementById("subjectSelect");

    subjectSelect.innerHTML = "";

    const subjects =
        Object.keys(student.classTests);

    subjects.forEach(function(subject){

        const option =
            document.createElement("option");

        option.value = subject;

        option.textContent = subject;

        subjectSelect.appendChild(option);

    });

    loadSubjectTable(subjects[0]);

    subjectSelect.addEventListener("change", function(){

        loadSubjectTable(this.value);

    });

}


/*====================================================
            LOAD SUBJECT TABLE
====================================================*/

function loadSubjectTable(subject){

    const table =
        document.getElementById("classTestTable");

    table.innerHTML = "";

    const tests =
        student.classTests[subject];

    tests.forEach(function(item){

        const percentage =
            ((item.obtained / item.total) * 100).toFixed(1);

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${item.test}</td>

            <td>${item.date}</td>

            <td>${item.obtained}</td>

            <td>${item.total}</td>

            <td>${percentage}%</td>

            <td>${item.grade}</td>

        `;

        table.appendChild(row);

    });

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