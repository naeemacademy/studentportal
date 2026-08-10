/*====================================================
            NAEEM ACADEMY
        STUDENT PORTAL LOGIN
====================================================*/

/*====================================================
            PASSWORD SHOW / HIDE
====================================================*/

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");

    }

    else {

        passwordInput.type = "password";

        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");

    }

});


/*====================================================
                LOGIN FORM
====================================================*/

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    loginStudent();

});


/*====================================================
            LOGIN FUNCTION
====================================================*/

async function loginStudent() {

    const studentClass = document.getElementById("studentClass").value;

    const rollNo = document.getElementById("rollNo").value.trim();

    const password = passwordInput.value.trim();


    /*==============================
            VALIDATION
    ==============================*/

    if (!studentClass || !rollNo || !password) {

        alert("Please fill all fields.");

        return;

    }


    try {

        /*==============================
            LOAD JSON
        ==============================*/

        const response = await fetch("data/students.json");

        if (!response.ok) {

            throw new Error("Unable to load students.");

        }

        const students = await response.json();


        /*==============================
            FIND STUDENT
        ==============================*/

        const student = students.find(function(item){

            return (

                // Class must match exactly
                item.class === studentClass &&

                // Roll number is case-insensitive
                item.rollNo.toLowerCase() === rollNo.toLowerCase() &&

                // Password must match exactly
                item.password === password

            );

        });


        /*==============================
            LOGIN SUCCESS
        ==============================*/

        if(student){

            // Remove any previous session
            sessionStorage.clear();

            // Save current student
            sessionStorage.setItem("studentId", student.id);

            // Open Dashboard
            showLoader();

        }

        else{

            alert("Invalid Class, Roll Number or Password.");

        }

    }

    catch(error){

        console.error(error);

        alert("Unable to load student records.");

    }

}


/*====================================================
            LOADING SCREEN
====================================================*/

function showLoader(){

    const loader = document.getElementById("loader");

    const loadingFill = document.querySelector(".loading-fill");

    loader.classList.add("show");

    loadingFill.classList.add("loading");

    setTimeout(function(){

        window.location.replace("dashboard.html");

    },2000);

}