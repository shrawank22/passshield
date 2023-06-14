function validatePassword() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm_password").value;
  var errorElement = document.getElementById("password_error");

  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match.";
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}


function togglePasswordVisibility() {
  var passwordField = document.getElementById("password");
  var toggleBtn = document.getElementById("toggleBtn");

  if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleBtn.classList.remove("fa-eye-slash");
      toggleBtn.classList.add("fa-eye");
  } else {
      passwordField.type = "password";
      toggleBtn.classList.remove("fa-eye");
      toggleBtn.classList.add("fa-eye-slash");
  }
}