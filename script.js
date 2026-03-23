// ======= LOGIN & DAFTAR =======
const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");

document.getElementById("showRegister").addEventListener("click", () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", () => {
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
});

// Simpan akun di localStorage sederhana
function saveUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
}

// Cek akun
function checkUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users[username] && users[username] === password;
}

// Register
document.getElementById("registerBtn").addEventListener("click", () => {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    if(!username || !password){ alert("Isi semua field!"); return;}
    saveUser(username, password);
    alert("Berhasil daftar! Silahkan login.");
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
});

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if(!username || !password){ alert("Isi semua field!"); return;}
    if(checkUser(username, password)){
        localStorage.setItem("loggedUser", username);
        window.location.href = "ai.html";
    } else {
        alert("Username atau password salah!");
    }
});

// ======= CHAT AI =======

// Hanya jalankan di ai.html
if(document.getElementById("chatContainer")){

let userLang = "id"; // Bahasa default

// Tambah pesan
function appendMessage(text, sender){
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// AI cepat
async function getAIResponse(message){
    const msg = message.toLowerCase().trim();

    if(msg === "hii" || msg === "hai" || msg === "hello"){
        return "HII";
    }

    if(msg.includes("siapa penciptamu") || msg.includes("siapa yang membuatmu")){
        return "Aditya atau RevvNight";
    }

    if(msg.length < 5){
        const jokes = ["Haha lucu banget!","Wkwk bener juga 😆","Eh jangan gitu dong 😅"];
        return jokes[Math.floor(Math.random()*jokes.length)];
    }

    appendMessage("Sedang mencari informasi....","ai");
    return new Promise(resolve=>{
        setTimeout(()=>resolve(`Ini informasi cepat tentang "${message}"`),800);
    });
}

// Kirim pesan
document.getElementById("sendBtn").addEventListener("click", async()=>{
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if(!message) return;
    appendMessage(message,"user");
    input.value="";
    const reply = await getAIResponse(message);
    appendMessage(reply,"ai");
});

// Enter key
document.getElementById("userInput").addEventListener("keypress", async(e)=>{
    if(e.key==="Enter") document.getElementById("sendBtn").click();
});

} // end ai.html check
