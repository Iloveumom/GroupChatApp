 let loguserid=null;
window.onload = async function() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    await getLoggedInUser();
    await getMessages();
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
async function getMessages() {
  const chat = document.getElementById("chatBody");
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get("http://localhost:4000/chat/messages", {
      headers: { Authorization: token }
    });

    chat.innerHTML = "";

  res.data.data.forEach(msg => {
  const div = document.createElement("div");
  // console.log("hello",msg.id,loguserid);
  if (msg.UserId === loguserid) {
    div.className = "chat-message chat-message-right"; // login user
    console.log("hello");
  } else {
    div.className = "chat-message chat-message-left"; // other user
  }

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  div.innerHTML = `
    <span>${msg.message}</span>
    <small>${time}</small>
    <p class="chat-username">${msg.User?.name || "User"}</p>
  `;

  chat.appendChild(div);
});


    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    console.error("Failed to load messages", error);
  }
}

async function getLoggedInUser() {
  const token = localStorage.getItem("token");

  const res = await axios.get("http://localhost:4000/me/details", {
    headers: {
      Authorization: token
    }
  });
   
  loguserid=res.data.userId;
}

