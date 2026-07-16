document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const remember = document.querySelector(
        '.login-options input[type="checkbox"]'
    );

    const loginBtn = document.querySelector(".login-btn");

    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {

        email.value = savedEmail;
        remember.checked = true;

    }

    const wrapper = password.parentElement;

    wrapper.style.position = "relative";

    const eye = document.createElement("i");

    eye.className = "fa-solid fa-eye";

    eye.style.position = "absolute";
    eye.style.right = "18px";
    eye.style.top = "48px";
    eye.style.cursor = "pointer";
    eye.style.color = "#64748B";

    wrapper.appendChild(eye);

    eye.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";
            eye.className = "fa-solid fa-eye-slash";

        } else {

            password.type = "password";
            eye.className = "fa-solid fa-eye";

        }

    });

    function validateEmail(value) {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(value);

    }

    function validatePassword(value) {

        return value.length >= 6;

    }

    function showError(input) {

        input.classList.remove("success");
        input.classList.add("error");

    }

    function showSuccess(input) {

        input.classList.remove("error");
        input.classList.add("success");

    }

    function clearState(input) {

        input.classList.remove("error");
        input.classList.remove("success");

    }

    email.addEventListener("input", () => {

        if (email.value === "") {

            clearState(email);

            return;

        }

        if (validateEmail(email.value)) {

            showSuccess(email);

        } else {

            showError(email);

        }

    });

    password.addEventListener("input", () => {

        if (password.value === "") {

            clearState(password);

            return;

        }

        if (validatePassword(password.value)) {

            showSuccess(password);

        } else {

            showError(password);

        }

    });

    document.addEventListener("keydown", e => {

        if (e.key === "Enter") {

            form.requestSubmit();

        }

    });

    form.addEventListener("submit", e => {

        e.preventDefault();

        let valid = true;

        // Email

        if (!validateEmail(email.value.trim())) {

            showError(email);

            valid = false;

        } else {

            showSuccess(email);

        }

        // Password

        if (!validatePassword(password.value.trim())) {

            showError(password);

            valid = false;

        } else {

            showSuccess(password);

        }

        if (!valid) {

            shakeCard();

            return;

        }

        // Remember Me

        if (remember.checked) {

            localStorage.setItem(
                "rememberEmail",
                email.value
            );

        } else {

            localStorage.removeItem(
                "rememberEmail"
            );

        }

        // Save Session

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );

        sessionStorage.setItem(
            "user",
            email.value
        );

        // Loading

        loginBtn.classList.add("loading");

        loginBtn.innerHTML =
            "Signing In...";

        loginBtn.disabled = true;

        // Fake API Delay

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1800);

    });

    function shakeCard() {

        const card =
            document.querySelector(".login-card");

        card.animate(

            [

                { transform: "translateX(0)" },

                { transform: "translateX(-10px)" },

                { transform: "translateX(10px)" },

                { transform: "translateX(-8px)" },

                { transform: "translateX(8px)" },

                { transform: "translateX(0)" }

            ],

            {

                duration: 450

            }

        );

    }

    const inputs =
        document.querySelectorAll("input");

    inputs.forEach(input => {

        input.addEventListener("focus", () => {

            input.parentElement.style.transform =
                "translateY(-2px)";

        });

        input.addEventListener("blur", () => {

            input.parentElement.style.transform =
                "translateY(0)";

        });

    });

    const sso =
        document.querySelector(".sso-btn");

    sso.addEventListener("click", () => {

        alert(
            "SSO Authentication will be integrated with Azure AD / Okta."
        );

    });

    console.log(
        "Digital Enterprise Login Ready."
    );

});