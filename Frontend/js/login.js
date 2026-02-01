document.addEventListener("DOMContentLoaded", () => {

   const loginForm = document.getElementById("loginForm");
  
 //alert(loginForm.innerHTML);
loginForm.addEventListener("submit", (e) => {
   e.preventDefault();
 const emailorphone = document.getElementById("emailorphone").value.trim();
  const password = document.getElementById("password").value.trim();

  let isValid = true;
  if (emailorphone === "") {
    document.getElementById("emailError").innerText = "Email or phone is required";
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
  axios.post("http://localhost:4000/user/login", {
    emailorphone: emailorphone,
    password: password
  })
  .then(response => {
 
    localStorage.setItem("token",response.data.token);
    const msg=document.getElementById("Msg");
    msg.innerText =response.data.message;
    msg.style="color:green";
    alert("Login successs");
    window.location.href = "index.html";
  })
  .catch(error => {
     console.log(error);
     const msg=document.getElementById("Msg");
     msg.innerText =error.response.data.message
     msg.style="color:red";
     document.getElementById("loginForm").reset();
  });
});
 
});
