   document.addEventListener("DOMContentLoaded", () => {

   const signupForm = document.getElementById("signupForm");
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();

    
  let isValid = true;

  // validation
  if (name === "") {
    document.getElementById("nameError").innerText = "Name is required";
    isValid = false;
  }
  if (phone === "") {
    document.getElementById("phoneError").innerText = "Phone number is required";
    isValid = false;
  }
  if (email === "") {
    document.getElementById("emailError").innerText = "Email is required";
    isValid = false;
  } else if (!email.includes("@")) {
    document.getElementById("emailError").innerText = "Invalid email";
    isValid = false;
  }

  if (password === "") {
    document.getElementById("passwordError").innerText = "Password is required";
    isValid = false;
  } else if (password.length < 6) {
    document.getElementById("passwordError").innerText = "Min 6 characters required";
    isValid = false;
  }

  // if validation fail
  if (!isValid) return false;

  // axios post request
  axios.post("http://localhost:4000/user/signup", {
    name: name,
    email: email,
    phone:phone,
    password: password
  })
  .then(response => {
    alert(response.data.message);
    window.location.href = "login.html";
  })
  .catch(error => {
    console.log(error);
   
     const msg=document.getElementById("Msg");
     msg.innerText =error.response.data.message
     msg.style="color:red;text-align:center";
     document.getElementById("signupForm").reset();
  });
  });
});