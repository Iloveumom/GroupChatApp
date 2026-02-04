let socket;
let userId;
let currentRoomId = null;
let currentGroupAdminId = null;

let users = [];
let groups = [];
window.onload = async () => {
  try {
    socket = io("http://localhost:4000", {
      auth: { token: localStorage.getItem("token") }
    });

    const me = await axios.get("http://localhost:4000/me/details", {
      headers: { Authorization: localStorage.getItem("token") }
    });
    
    userId = me.data.userId;
    document.getElementById("userName").innerText = me.data.name || "User";
    document.getElementById("userEmail").innerText = me.data.email;

    const res = await axios.get("http://localhost:4000/user/getAllUsers", {
      headers: { Authorization: localStorage.getItem("token") }
    });
    users = res.data;
    renderUsers();

    /*OLD PERSONAL CHAT HISTORY */
    socket.on("personal-chat-history", (data) => {
      currentRoomId = data.conversationId;
      clearChat();
      data.messages.forEach(msg => {
        renderMessage(msg);
      });
    });
   /*OLD Group CHAT HISTORY */
   socket.on("group-chat-history", (data) => 
    {
        currentRoomId = data.conversationId;
        clearChat();
        data.messages.forEach(renderMessage);
    });

    /* NEW MESSAGES */
   /* ---------------- NEW MESSAGES ---------------- */
socket.on("new-personal-message", (msg) => {
  // sirf tab render karo jab personal chat me ho aur currentRoomId match ho
  if (currentGroupAdminId === null && msg.conversationId === currentRoomId) {
    renderMessage(msg);
  }
});

socket.on("new-group-message", (msg) => {
  // sirf tab render karo jab group chat me ho aur currentRoomId match ho
  if (currentGroupAdminId !== null && msg.conversationId === currentRoomId) {
    renderMessage(msg);
  }
});


    socket.on("group-created", g => {
      groups.push(g);
      renderGroups();
    });

    await loadMyGroups( );

  } catch (err) {
    console.error(err);
    alert("Init failed");
  }
};
//--------Load Group front backend----//
async function loadMyGroups() {
  try {
    const res = await axios.get("http://localhost:4000/group/getMyGroups", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    groups = res.data;
    renderGroups();

  } catch (err) {
    console.error("Load group failed", err);
  }
}


// ---------------- USERS ---------------- 

function renderUsers() {
  const userBox = document.getElementById("userList");
  const groupBox = document.getElementById("groupUsers");

  userBox.innerHTML = "";
  groupBox.innerHTML = "";

  users.forEach(u => {
    if (u.id === userId) return;

    const div = document.createElement("div");
    div.className = "room-item";
    div.innerText = u.email;
    div.onclick = () => startPersonalChat(u);
    userBox.appendChild(div);

    const c = document.createElement("div");
    c.innerHTML = `<input type="checkbox" value="${u.id}"> ${u.email}`;
    groupBox.appendChild(c);
  });
}

/* ---------------- PERSONAL CHAT ---------------- */

function startPersonalChat(user) {
  socket.emit("join-personal", {
    receiverId: user.id
  });

  clearChat();
  setTitle(user.email);
  currentGroupAdminId = null;
}

/* ---------------- GROUP ---------------- */

function createGroup() {
  const name = document.getElementById("groupName").value.trim();
  if (!name) return alert("Group name required");

  const checked = document.querySelectorAll("#groupUsers input:checked");
  if (!checked.length) return alert("Select members");

  const members = Array.from(checked).map(c => c.value);

  socket.emit("create-group", { name, members });

  document.getElementById("groupName").value = "";
  checked.forEach(c => (c.checked = false));
}

function renderGroups() {
  const box = document.getElementById("groupList");
  box.innerHTML = "";

  groups.forEach(g => {
    const div = document.createElement("div");
    div.className = "room-item";
    div.innerHTML = `<span>${g.name}</span>`;

    if (g.adminId === userId) {
      div.innerHTML += ` <button class="admin-btn">Admin</button>`;
    }

    div.onclick = () => joinGroup(g);
    box.appendChild(div);
  });
}

function joinGroup(group) {
  currentRoomId = group.id;
  currentGroupAdminId = group.adminId;

  socket.emit("join-group", { groupId: group.id });

  clearChat();
  setTitle(group.name + " (Group)");
}

/* ---------------- MESSAGE ---------------- */

function sendMessage() {
  const input = document.getElementById("msgInput");
  if (!input.value || !currentRoomId) return;

  if (currentGroupAdminId !== null) {
    socket.emit("group-message", {
      conversationId: currentRoomId,
      message: input.value
    });
  } else {
    socket.emit("personal-message", {
      roomId: currentRoomId,
      message: input.value
    });
  }

  input.value = "";
}

function renderMessage(msg) {
  const chat = document.getElementById("chatBody");

  const div = document.createElement("div");
  div.className = "msg " + (msg.senderId === userId ? "right" : "left");

  // MEDIA MESSAGE
  if (msg.mediaUrl) {

    // IMAGE
    if (msg.fileType && msg.fileType.startsWith("image")) {
      div.innerHTML = `
        <b>${msg.userName}</b><br>
        <img src="${msg.mediaUrl}" class="chat-img" />
      `;
    }

    // VIDEO
    else if (msg.fileType && msg.fileType.startsWith("video")) {
      div.innerHTML = `
        <b>${msg.userName}</b><br>
        <video controls class="chat-video">
          <source src="${msg.mediaUrl}" type="${msg.fileType}">
        </video>
      `;
    }

    // OTHER FILE
    else {
      div.innerHTML = `
        <b>${msg.userName}</b><br>
        <a href="${msg.mediaUrl}" target="_blank">📎 Download file</a>
      `;
    }

  } 
  // TEXT MESSAGE
  else {
    div.innerText = `${msg.userName}: ${msg.message}`;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ---------------- UTILS ---------------- */

function clearChat() {
  document.getElementById("chatBody").innerHTML = "";
}

function setTitle(text) {
  document.getElementById("chatTitle").innerText = text;
}

function handleEnter(e) {
  if (e.key === "Enter") sendMessage();
}
function logout() {
  localStorage.removeItem("token");

  if (socket) {
    socket.disconnect();
  }

  window.location.href = "login.html";
}

//Multimedia code start 
function openFile() {
  document.getElementById("fileInput").click();
}
document.getElementById("fileInput").addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversationId", currentRoomId);

  try {
    const res = await axios.post(
      "http://localhost:4000/media/upload",
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      }
    );
    
    // backend se S3 URL aayega
    socket.emit("media-message", {
      conversationId: currentRoomId,
      mediaUrl: res.data.url,
      fileType: file.type
    });

  } catch (err) {
    console.error("Upload failed", err);
  }
});
