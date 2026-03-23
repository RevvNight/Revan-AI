// ======== DATA ========
let currentUser = localStorage.getItem("user");
let usersData = JSON.parse(localStorage.getItem("usersData") || "{}");
const ownerName = "RevvNight";

// ======== LOGIN ========
if(currentUser) showChat();
function register(){
  let user = document.getElementById("username").value.trim();
  if(!user) return alert("Isi username!");
  if(!usersData[user]){
    usersData[user] = {
      admin:user===ownerName,
      coins:0,
      premium:false,
      friends:[],
      messages:{},
      bio:""
    };
  }
  localStorage.setItem("usersData", JSON.stringify(usersData));
  localStorage.setItem("user", user);
  currentUser = user;
  showChat();
}

// ======== LOGOUT ========
function logout(){
  localStorage.removeItem("user");
  location.reload();
}

// ======== DASHBOARD ========
function showChat(){
  document.getElementById("auth").style.display="none";
  document.getElementById("chatUI").style.display="block";
  if(usersData[currentUser].admin) document.getElementById("adminPanel").style.display="block";
  renderFriends();
  updateLeaderboard();
}

// ======== SEARCH USER ========
function filterUsers(){
  let val = document.getElementById("searchUser").value.toLowerCase();
  renderFriends(val);
}
function renderFriends(filter=""){
  let list = document.getElementById("friendsList");
  list.innerHTML = "";
  Object.keys(usersData).forEach(u=>{
    if(u!==currentUser && u.toLowerCase().includes(filter)){
      let li = document.createElement("li");
      li.textContent = u;
      li.onclick = ()=>openFriendChat(u);
      list.appendChild(li);
    }
  });
}

// ======== FRIEND CHAT ========
let currentFriend = null;
function openFriendChat(friend){
  currentFriend = friend;
  document.getElementById("friendChatBox").style.display="block";
  document.getElementById("chatWith").textContent = "Chat dengan: "+friend;
  if(!usersData[currentUser].messages[friend]) usersData[currentUser].messages[friend]=[];
  if(!usersData[friend].messages[currentUser]) usersData[friend].messages[currentUser]=[];
  renderFriendChat();
}
function sendFriendMessage(){
  if(!currentFriend) return;
  let text = document.getElementById("friendInput").value.trim();
  if(!text) return;
  usersData[currentUser].messages[currentFriend].push({from:currentUser,text:text});
  usersData[currentFriend].messages[currentUser].push({from:currentUser,text:text});
  localStorage.setItem("usersData",JSON.stringify(usersData));
  document.getElementById("friendInput").value="";
  renderFriendChat();
}
function renderFriendChat(){
  if(!currentFriend) return;
  let msgs = usersData[currentUser].messages[currentFriend]||[];
  let box = document.getElementById("privateChat");
  box.innerHTML="";
  msgs.forEach(m=>{
    let div = document.createElement("div");
    div.textContent = `${m.from}: ${m.text}`;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

// ======== CHAT AI ========
let aiOpen = false;
function toggleAI(){
  aiOpen = !aiOpen;
  document.getElementById("input").focus();
}
async function sendMessage(){
  let text = document.getElementById("input").value.trim();
  if(!text) return;
  if(!usersData[currentUser].premium){
    alert("Upgrade ke premium dulu 😢\nFitur AI hanya untuk premium!");
    return;
  }

  usersData[currentUser].coins++;
  document.getElementById("chat").innerHTML += `<div class="userBubble">${text}</div>`;
  document.getElementById("input").value="";
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  let botDiv = document.createElement("div");
  botDiv.className = "botBubble";
  botDiv.textContent = "🤖 Mencari informasi...";
  document.getElementById("chat").appendChild(botDiv);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  let response = await fetchInfo(text);
  botDiv.textContent = response;
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

// Simulasi fetch info dari internet
function fetchInfo(query){
  return new Promise((resolve)=>{
    let found = Math.random() > 0.3;
    let delay = 5000 + Math.random()*10000; // 5-15 detik
    if(delay>15000) delay = 15000;
    setTimeout(()=>{
      if(found) resolve(`Info ditemukan untuk "${query}" ✅\nSimulasi hasil pencarian Roblox`);
      else resolve("Maaf informasi saat ini tidak ditemukan 😢");
    }, delay);
  });
}

// ======== PREMIUM IMAGE & VIDEO ========
function createImageAI(prompt){
  if(!usersData[currentUser].premium){
    alert("Upgrade ke premium dulu 😢");
    return;
  }
  return `Gambar AI: "${prompt}" 🎨 (tanpa watermark)`;
}
function createVideoAI(prompt){
  if(!usersData[currentUser].premium){
    alert("Upgrade ke premium dulu 😢");
    return;
  }
  return `Video AI: "${prompt}" 🎬`;
}

// ======== LEADERBOARD ========
function updateLeaderboard(){
  let sorted = Object.entries(usersData).sort((a,b)=>b[1].coins-a[1].coins);
  let topUsers = document.getElementById("friendsList");
  topUsers.innerHTML="";
  sorted.forEach(([user,data])=>{
    let badge = data.admin?" ✔️":"";
    let prem = data.premium?" 🔥":"";
    let li = document.createElement("li");
    li.textContent = `${user}${badge}${prem} - ${data.coins}💰`;
    topUsers.appendChild(li);
  });
}

// ======== ADMIN PANEL ========
function giveCoins(){
  let u = document.getElementById("giveCoinsUser").value.trim();
  let amt = parseInt(document.getElementById("giveCoinsAmount").value);
  if(!usersData[u]||isNaN(amt)) return alert("Input salah!");
  usersData[u].coins+=amt;
  localStorage.setItem("usersData",JSON.stringify(usersData));
  updateLeaderboard();
  alert("Coins diberikan ✅");
}
function givePremium(){
  let u = document.getElementById("givePremiumUser").value.trim();
  if(!usersData[u]) return alert("User tidak ada!");
  usersData[u].premium=true;
  localStorage.setItem("usersData",JSON.stringify(usersData));
  alert(`${u} sekarang premium ✅`);
}
function giveAdmin(){
  let u = document.getElementById("giveAdminUser").value.trim();
  if(!usersData[u]) return alert("User tidak ada!");
  usersData[u].admin=true;
  localStorage.setItem("usersData",JSON.stringify(usersData));
  updateLeaderboard();
  alert("Admin diberikan ✅");
}
function banUserFunc(){
  let u = document.getElementById("banUserInput").value.trim();
  if(!usersData[u]) return alert("User tidak ada!");
  delete usersData[u];
  localStorage.setItem("usersData",JSON.stringify(usersData));
  updateLeaderboard();
  alert("User dibanned ✅");
}

// ======== REPORT SYSTEM ========
let reports=[];
function reportClient(from,text){reports.push({from,text}); renderReports();}
function renderReports(){
  let rList = document.getElementById("reportsList");
  rList.innerHTML="";
  reports.forEach(r=>{
    let li = document.createElement("li");
    li.textContent = `${r.from}: ${r.text}`;
    rList.appendChild(li);
  });
      }
