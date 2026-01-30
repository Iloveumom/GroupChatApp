function send()
 {
  const input = document.getElementById("typemessage");
  const chat = document.getElementById("chatBody");

  if (input.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.className = "msg outgoing";

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  msg.innerHTML = `<span>${input.value}</span><small>${time}</small>`;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  input.value = "";
}
