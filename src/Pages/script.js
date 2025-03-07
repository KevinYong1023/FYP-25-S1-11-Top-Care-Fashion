document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Save to localStorage (or send to backend)
    let user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration Successful!");
    window.location.href = "login.html"; // Redirect to login page
});
