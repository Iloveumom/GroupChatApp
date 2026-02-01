let loguserid = null;
let socket = null;

window.onload = async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  await getLoggedInUser();
  await getMessages();
  initWebSocket();
};

// =========================
// Send message function
// =========================
function send() {
  const input = document.getElementById("typemessage");
  if (!input.value.trim()) return;

  const msg = {
    message: input.value,
    userId: loguserid,
    userName: "You",
    createdAt: new Date()
  };

  // UI me turant show karo
  renderMessage(msg);

  socket.emit("chat-message",msg);

  input.value = "";
}


// =========================
// Render message
// =========================
function renderMessage(msg) {
    const chat = document.getElementById("chatBody");
    const div = document.createElement("div");
    console.log(msg.userId,loguserid);
    // login user left, others right
    if (msg.userId === loguserid)
      {
         div.className = "chat-message chat-message-right";
      }
      else 
        {
          div.className = "chat-message chat-message-left";
        }
    const time = new Date(msg.createdAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
//alert(div.className);
    div.innerHTML = `
        <span>${msg.message}</span>
        <small>${time}</small>
        <p class="chat-username">${msg.User?.name || msg.userName || "User"}</p>
    `;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}


// =========================
// Load old messages from REST
// =========================
async function getMessages() {
  const chat = document.getElementById("chatBody");
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get("http://localhost:4000/chat/messages", {
      headers: { Authorization: token }
    });

    chat.innerHTML = "";

   res.data.data.forEach(msg => {
  // Map REST UserId -> userId for consistency
  const m = {
    message: msg.message,
    userId: msg.UserId,
    User: msg.User,
    createdAt: msg.createdAt
  };
  renderMessage(m);
});


  } catch (error) {
    console.error("Failed to load messages", error);
  }
}

// =========================
// Get logged-in user ID
// =========================
async function getLoggedInUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:4000/me/details", {
    headers: { Authorization: token }
  });

  loguserid = res.data.userId;
}

// =========================
// WebSocket setup for live messages(getMessage)
// =========================
function initWebSocket() {
   // backend socket io server
  socket = io("http://localhost:4000");

  socket.on("chat-message", (data) => 
    {
        if (data.userId === loguserid) return;
      renderMessage(data);
   });
 
}