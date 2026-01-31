window.onload = async function() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
}

async function send() {
  const input = document.getElementById("typemessage");
  const chat = document.getElementById("chatBody");

  if (input.value.trim() === "") return;

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  // UI update first
  const msg = document.createElement("div");
  msg.className = "msg outgoing";
  msg.innerHTML = `<span>${input.value}</span><small>${time}</small>`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
const token = localStorage.getItem("token"); // client-side token

try {
  await axios.post(
    "http://localhost:4000/chat/message",
    { message: input.value },
    {
      headers: {
        Authorization:token, 
      },
    }
  );
} catch (error) {
  console.error("Message save failed", error);
  if (error.response && error.response.status === 401) {
    alert("Session expired. Please login again.");
    //localStorage.removeItem("token");
   // window.location.href = "login.html";
  }
}

  input.value = "";
}
