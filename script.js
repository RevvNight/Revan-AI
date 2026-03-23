// ===== DATA =====
let currentUser = localStorage.getItem("user");
let usersData = JSON.parse(localStorage.getItem("usersData") || "{}");
const ownerName = "RevvNight";

// ===== LOGIN =====
if(currentUser && window.location.pathname.includes("ai.html")) showChat();

function login(){
  let user = document.getElementById("username").value.trim();
  if(!user) return alert("Isi username!");
  if(!usersData[user]){
    usersData[user] = {
      admin:user===ownerName
    };
    localStorage.setItem("usersData",JSON.stringify(usersData));
  }
  localStorage.setItem("user",user);
  currentUser = user;
  window.location.href = "ai.html";
}

// ===== LOGOUT =====
function logout(){localStorage.removeItem("user");window.location.href="index.html";}

// ===== CHAT AI =====
async function sendMessage(){
  let text = document.getElementById("input").value.trim();
  if(!text) return;
  document.getElementById("input").value="";

  // tampil user bubble
  document.getElementById("chat").innerHTML += `<div class="userBubble">${text}</div>`;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  // tampil loading
  let botDiv = document.createElement("div");
  botDiv.className="botBubble";
  botDiv.textContent = "🤖 Revan AI sedang mencari informasi...";
  document.getElementById("chat").appendChild(botDiv);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  // proses AI (simulasi cepat max 5 detik)
  let response = await fetchAI(text);
  botDiv.textContent = response;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

// ===== SIMULASI AI =====
function fetchAI(query){
  return new Promise(resolve=>{
    let delay = 1000 + Math.random()*4000; // 1-5 detik
    setTimeout(()=>{
      resolve(`Revan AI 💡:\nInfo/Script/Gambar/Video Roblox untuk: "${query}"`);
    }, delay);
  });
}

// ===== IMAGE & VIDEO GRATIS =====
function createImageAI(prompt){
  return `Gambar AI: "${prompt}" 🎨 (Kualitas bagus, unlimited)`;
}

function createVideoAI(prompt){
  return `Video AI: "${prompt}" 🎬 (Kualitas bagus, unlimited)`;
}

// ===== SHOW CHAT (ketika reload ai.html) =====
function showChat(){
  if(!currentUser) return window.location.href="index.html";
}
