document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !email || !phone || !password) {
        alert("All fields are required");
        return;
      }
      alert("Signup successful (Frontend only)");
      signupForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const loginId = document.getElementById("loginId").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!loginId || !password) {
        alert("Please enter credentials");
        return;
      }

      alert("Login successful (Frontend only)");
      loginForm.reset();
    });
  }
});
