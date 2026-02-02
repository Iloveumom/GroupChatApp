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
/*
//this is for all user
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

*/

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
  const token = localStorage.getItem("token");
  socket = io("http://localhost:4000", {
    auth: {
      token:token
    }
  });
/*
  socket.on("chat-message", (data) => 
    {
        if (data.userId === loguserid) return;
      renderMessage(data);
   });
 */
 socket.on("new-message", (data) => 
    {
      console.log(data);
        //if (data.userId === loguserid) return;
      renderMessage(data);
   });
}

//Implement pesonal chat 
function send()
{
  const input = document.getElementById("typemessage");
  
  const message=input.value;
   

  // UI me turant show karo
  renderMessage(message);

  socket.emit("new-message",{message,roomName:window.roomname});

  input.value = "";
}

let emails = [];

// 1️⃣ Fetch all emails from backend when page loads
axios.get('users/getAllEmails') // replace with your API
    .then(res => {
        emails = res.data; // assume it's an array of emails
        renderEmailList(emails); // render left panel initially
    })
    .catch(err => console.error(err));

// Elements
const searchInput = document.querySelector('#searchForm input[name="search"]');
const roomList = document.getElementById('roomList');

//  Render email suggestions under search box (as a list)
function renderEmailList(list) {
    roomList.innerHTML = ''; // clear previous
    list.forEach(email => {
        const div = document.createElement('div');
        div.textContent = email;
        div.classList.add('room-item'); // you can style in CSS
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
            searchInput.value = email; // fill search box
        });
        roomList.appendChild(div);
    });
}

//  Filter emails while typing
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = emails.filter(email => email.toLowerCase().includes(query));
    renderEmailList(filtered);
});

// Form submit with validation
document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const myEmail = localStorage.getItem("emailorphone");
    const email = searchInput.value.trim();

    // Validate email exists in backend list
    if(!emails.includes(email)){
        alert("Please select a valid email from the list!");
        return;
    }

    //Join room
    const roomName = [myEmail, email].sort().join('-');
    window.roomname = roomName;
    socket.emit("join-room", roomName);
    alert("Room joined: " + roomName);
});
