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

  //  WebSocket send karo
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }

  input.value = "";
}


// =========================
// Render message
// =========================
function renderMessage(msg) {
    const chat = document.getElementById("chatBody");
    const div = document.createElement("div");

    // login user left, others right
    if (msg.userId === loguserid) div.className = "chat-message chat-message-left";
    else div.className = "chat-message chat-message-right";

    const time = new Date(msg.createdAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });

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
// WebSocket setup for live messages
// =========================
function initWebSocket() {
  socket = new WebSocket("ws://localhost:4000"); // backend ws server

  socket.onopen = () => console.log("WebSocket connected");

 socket.onmessage = (event) => {
    const msgData = JSON.parse(event.data);

    // Skip messages sent by login user (already appended in send())
    if (msgData.userId === loguserid) return;

    renderMessage(msgData);
};


  socket.onclose = () => console.log("WebSocket disconnected");
}
