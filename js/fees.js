/*====================================================
            NAEEM ACADEMY
            STUDENT FEES
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

        // Continue
        showCurrentMonth();

    }

    catch(error){

        console.error(error);

        alert("Unable to load student data.");

    }

}

/*====================================================
            SHOW CURRENT MONTH
====================================================*/

function showCurrentMonth(){

        // Get all available fee months
    const months =
        Object.keys(student.fee).filter(function(key){

            return key !== "monthlyFee";

        });

    // Get latest available month
    const currentMonth =
        months[months.length - 1];

    // Get fee record
    const fee =
        student.fee[currentMonth];

    // Monthly Fee
    document.getElementById("monthlyFee").textContent =
        "Rs. " + student.fee.monthlyFee;

    // Current Month
    document.getElementById("selectedMonth").textContent =
        currentMonth;

    // If month exists
    if(fee){

        const feeStatus =
            document.getElementById("feeStatus");

        feeStatus.textContent =
            fee.status;

        feeStatus.classList.remove("paid","unpaid");

        if(fee.status==="Paid"){

            feeStatus.classList.add("paid");

        }

        else{

            feeStatus.classList.add("unpaid");

        }

        document.getElementById("feePaidDate").textContent =
            fee.paidDate || "-";

        document.getElementById("remainingFee").textContent =
            fee.status==="Paid"
            ? "Rs. 0"
            : "Rs. " + student.fee.monthlyFee;

    }

    else{

        document.getElementById("feeStatus").textContent =
            "-";

        document.getElementById("feePaidDate").textContent =
            "-";

        document.getElementById("remainingFee").textContent =
            "Rs. " + student.fee.monthlyFee;

    }

    loadFeeHistory();

}

/*====================================================
                FEE HISTORY
====================================================*/

function loadFeeHistory(){

    const table =
        document.getElementById("feeHistoryTable");

    // Clear previous rows
    table.innerHTML = "";

    // Get all fee months
    const months =
        Object.keys(student.fee).filter(function(key){

            return key !== "monthlyFee";

        });

    // Create table rows
    months.forEach(function(month){

        const fee =
            student.fee[month];

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${month}</td>

            <td class="${
                fee.status === "Paid"
                ? "paid"
                : "unpaid"
            }">

                ${fee.status}

            </td>

            <td>

                ${fee.paidDate || "-"}

            </td>

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