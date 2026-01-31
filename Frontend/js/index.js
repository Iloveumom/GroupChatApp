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

  try {
    await axios.post("http://localhost:4000/chat/message", {
      user_id: 1,
      message: input.value
    });
  } catch (error) {
    console.error("Message save failed", error);
    alert("Message send nahi hua, dobara try karo");
  }

  input.value = "";
}
