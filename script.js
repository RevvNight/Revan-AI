let currentUser = localStorage.getItem("user");
let usersData = JSON.parse(localStorage.getItem("usersData") || "{}");
const ownerName = "RevvNight";

// HTML elements
const auth = document.getElementById("auth");
const username = document.getElementById("username");
const chatUI = document.getElementById("chatUI");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const topUsers = document.getElementById("topUsers");
const adminTools = document.getElementById("adminTools");
const banUser = document.getElementById("banUser");
const newAdminUser = document.getElementById("newAdminUser");
const friendsList = document.getElementById("friendsList");
const friendChatBox = document.getElementById("friendChatBox");
const chatWith = document.getElementById("chatWith");
const privateChat = document.getElementById("privateChat");
const friendInput = document.getElementById("friendInput");
const searchUser = document.getElementById("searchUser");
const searchResults = document.getElementById("searchResults");
const imgPrompt = document.getElementById("imgPrompt");

// INIT
if (currentUser) {
    showChat();
    renderFriendsList();
    updateLeaderboard();
}

// REGISTER / LOGIN
function register() {
    let user = username.value.trim();
    if (!user) return alert("Isi username dulu!");
    if (!usersData[user]) {
        usersData[user] = { admin: user===ownerName, coins:0, premium:false, imageCount:0, friends:[], messages:{} };
        localStorage.setItem("usersData", JSON.stringify(usersData));
    }
    localStorage.setItem("user", user);
    currentUser = user;
    showChat();
    renderFriendsList();
    updateLeaderboard();
}

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    location.reload();
}

// SHOW CHAT UI
function showChat() {
    auth.style.display = "none";
    chatUI.style.display = "block";
    adminTools.style.display = usersData[currentUser].admin ? "block":"none";
}

// CHAT AI
function send() {
    let text = input.value.trim();
    if (!text) return;
    usersData[currentUser].coins++;
    localStorage.setItem("usersData", JSON.stringify(usersData));
    chat.innerHTML += `<div class="userBubble">${text}</div>`;
    input.value="";
    chat.scrollTop = chat.scrollHeight;
    setTimeout(()=>{
        let res = ai(text);
        if (usersData[currentUser].premium) res+=" ✨ (Premium)";
        chat.innerHTML += `<div class="botBubble">${res}</div>`;
        chat.scrollTop = chat.scrollHeight;
        updateLeaderboard();
    }, usersData[currentUser].premium ? 200:500);
}

function ai(text) {
    text=text.toLowerCase();
    if (!text.includes("roblox")) return "Aku fokus Roblox 😄 tapi tetap temenin kamu 😊";
    if (text.includes("game")) return "Coba buat simulator atau tycoon Roblox 🔥";
    return "Menarik! Jelaskan lebih detail ya 😎";
}

// ADMIN
function ban() {
    let target = banUser.value.trim();
    if (!usersData[target]) return alert("User tidak ditemukan");
    delete usersData[target];
    localStorage.setItem("usersData", JSON.stringify(usersData));
    alert(`${target} telah dibanned 🚫`);
    updateLeaderboard();
    renderFriendsList();
}

function makeAdmin() {
    if (currentUser!==ownerName) return alert("Hanya owner bisa tambah admin!");
    let target = newAdminUser.value.trim();
    if (!target || !usersData[target]) return alert("User tidak ditemukan!");
    usersData[target].admin = true;
    localStorage.setItem("usersData", JSON.stringify(usersData));
    alert(`${target} sekarang ADMIN ✅`);
    updateLeaderboard();
    renderFriendsList();
}

// LEADERBOARD
function updateLeaderboard() {
    let sorted = Object.entries(usersData).sort((a,b)=>b[1].coins-a[1].coins);
    topUsers.innerHTML="";
    sorted.forEach(([user,data])=>{
        let badge = data.admin?" <span class='adminBadge'>✔️</span>":"";
        let prem = data.premium?" <span class='premiumBadge'>🔥</span>":"";
        topUsers.innerHTML += `<li>${user}${badge}${prem} - ${data.coins} 💰</li>`;
    });
}

// IMAGE GENERATOR
function generateImage() {
    let prompt = imgPrompt.value.trim();
    if (!prompt) return;
    if (!usersData[currentUser].premium && usersData[currentUser].imageCount>=5)
        return alert("Batas generate gambar harian 5. Upgrade premium!");
    if (!usersData[currentUser].premium) usersData[currentUser].imageCount++;
    localStorage.setItem("usersData", JSON.stringify(usersData));

    let img = new Image();
    img.src="https://picsum.photos/200"; 
    img.onload=()=>{
        let canvas=document.createElement("canvas");
        let ctx=canvas.getContext("2d");
        canvas.width=img.width; canvas.height=img.height;
        ctx.drawImage(img,0,0);
        ctx.fillStyle="white"; ctx.font="20px Arial";
        ctx.fillText("Revan AI",10,img.height-10);
        chat.innerHTML += `<div class="botBubble"><img src="${canvas.toDataURL()}" style="max-width:200px;border-radius:10px;"></div>`;
        chat.scrollTop=chat.scrollHeight;
    };
}

// FRIEND SYSTEM
function searchUserFunc() {
    let name=searchUser.value.trim();
    searchResults.innerHTML="";
    if (!usersData[name]) { searchResults.innerHTML="User tidak ditemukan 😢"; return; }
    if (name===currentUser) { searchResults.innerHTML="Ini kamu sendiri 😄"; return; }
    let btn=document.createElement("button");
    btn.textContent="Add Friend ➕";
    btn.onclick=()=>addFriend(name);
    searchResults.appendChild(document.createTextNode(name+" "));
    searchResults.appendChild(btn);
}

function addFriend(name) {
    if (usersData[currentUser].friends.includes(name)) return alert("User sudah temanmu 😎");
    usersData[currentUser].friends.push(name);
    if (!usersData[name].friends.includes(currentUser)) usersData[name].friends.push(currentUser);
    if (!usersData[currentUser].messages[name]) usersData[currentUser].messages[name]=[];
    if (!usersData[name].messages[currentUser]) usersData[name].messages[currentUser]=[];
    localStorage.setItem("usersData", JSON.stringify(usersData));
    alert(name+" sekarang temanmu ✅");
    renderFriendsList();
}

function renderFriendsList() {
    friendsList.innerHTML="";
    usersData[currentUser].friends.forEach(f=>{
        let li=document.createElement("li");
        li.textContent=f;
        li.style.cursor="pointer";
        li.onclick=()=>openFriendChat(f);
        friendsList.appendChild(li);
    });
}

let currentFriend=null;
function openFriendChat(friend) {
    currentFriend=friend;
    friendChatBox.style.display="block";
    chatWith.textContent="Chat dengan: "+friend;
    renderFriendChat();
}

function renderFriendChat() {
    if (!currentFriend) return;
    privateChat.innerHTML="";
    let msgs=usersData[currentUser].messages[currentFriend]||[];
    msgs.forEach(m=>{
        let div=document.createElement("div");
        div.textContent=`${m.from}: ${m.text}`;
        privateChat.appendChild(div);
    });
    privateChat.scrollTop=privateChat.scrollHeight;
}

function sendFriendMessage() {
    if (!currentFriend) return;
    let text=friendInput.value.trim();
    if (!text) return;
    usersData[currentUser].messages[currentFriend].push({from:currentUser,text:text});
    usersData[currentFriend].messages[currentUser].push({from:currentUser,text:text});
    localStorage.setItem("usersData", JSON.stringify(usersData));
    friendInput.value="";
    renderFriendChat();
  }
