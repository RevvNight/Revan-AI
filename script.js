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
      admin:user===ownerName,
      premium:false,
      dailyImages:0,
      dailyVideos:0,
      lastReset: Date.now()
    };
    localStorage.setItem("usersData",JSON.stringify(usersData));
  }
  localStorage.setItem("user",user);
  currentUser = user;
  window.location.href = "ai.html";
}

// ===== LOGOUT =====
function logout(){localStorage.removeItem("user");window.location.href="index.html";}

// ===== RESET HARIAN =====
function resetDaily(){
  let today = new Date().setHours(0,0,0,0);
  for(let u in usersData){
    if(!usersData[u].premium && usersData[u].lastReset < today){
      usersData[u].dailyImages = 0;
      usersData[u].dailyVideos = 0;
      usersData[u].lastReset = Date.now();
    }
  }
  localStorage.setItem("usersData",JSON.stringify(usersData));
}
resetDaily();

// ===== CHAT AI =====
async function sendMessage(){
  let text = document.getElementById("input").value.trim();
  if(!text) return;
  document.getElementById("input").value="";

  if(!usersData[currentUser].premium){
    alert("Upgrade ke premium dulu 😢\nFitur AI Pro hanya untuk premium!");
    return;
  }

  // tampil user bubble
  document.getElementById("chat").innerHTML += `<div class="userBubble">${text}</div>`;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  // tampil loading
  let botDiv = document.createElement("div");
  botDiv.className="botBubble";
  botDiv.textContent = "🤖 Revan AI sedang mencari informasi...";
  document.getElementById("chat").appendChild(botDiv);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  // proses AI (simulasi max 15 detik)
  let response = await fetchAI(text);
  botDiv.textContent = response;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

// ===== SIMULASI AI PREMIUM =====
function fetchAI(query){
  return new Promise(resolve=>{
    let found = Math.random() > 0.1; // 90% chance info ada
    let delay = 5000 + Math.random()*10000; // 5-15 detik
    if(delay>15000) delay=15000;
    setTimeout(()=>{
      if(found) resolve(`Revan AI Pro 💡:\nInfo/Script/Gambar/Video Roblox untuk: "${query}"`);
      else resolve("Maaf informasi saat ini tidak ditemukan 😢");
    }, delay);
  });
}

// ===== PREMIUM IMAGE & VIDEO =====
function createImageAI(prompt){
  resetDaily();
  let user = usersData[currentUser];
  if(user.premium || user.dailyImages < 10){
    if(!user.premium) user.dailyImages++;
    localStorage.setItem("usersData",JSON.stringify(usersData));
    return `Gambar AI: "${prompt}" 🎨 (Kualitas bagus, ${user.premium?'∞':'Batas hari ini: '+user.dailyImages+'/10'})`;
  } else {
    return "Batas gambar harian telah tercapai. Upgrade ke premium untuk unlimited!";
  }
}

function createVideoAI(prompt){
  resetDaily();
  let user = usersData[currentUser];
  if(user.premium || user.dailyVideos < 1){
    if(!user.premium) user.dailyVideos++;
    localStorage.setItem("usersData",JSON.stringify(usersData));
    return `Video AI: "${prompt}" 🎬 (Kualitas bagus, ${user.premium?'∞':'Batas hari ini: '+user.dailyVideos+'/1'})`;
  } else {
    return "Batas video harian telah tercapai. Upgrade ke premium untuk unlimited!";
  }
}
