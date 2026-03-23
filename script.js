// ===== LOGIN & DAFTAR =====
const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");

if(loginContainer && registerContainer){
    document.getElementById("showRegister").addEventListener("click",()=>{
        loginContainer.style.display="none";
        registerContainer.style.display="block";
    });
    document.getElementById("showLogin").addEventListener("click",()=>{
        loginContainer.style.display="block";
        registerContainer.style.display="none";
    });

    function saveUser(username,password){
        const users=JSON.parse(localStorage.getItem("users")||"{}");
        users[username]=password;
        localStorage.setItem("users",JSON.stringify(users));
    }

    function checkUser(username,password){
        const users=JSON.parse(localStorage.getItem("users")||"{}");
        return users[username] && users[username]===password;
    }

    document.getElementById("registerBtn").addEventListener("click",()=>{
        const username=document.getElementById("regUsername").value.trim();
        const password=document.getElementById("regPassword").value.trim();
        if(!username||!password){alert("Isi semua field!");return;}
        saveUser(username,password);
        alert("Berhasil daftar! Silahkan login.");
        registerContainer.style.display="none";
        loginContainer.style.display="block";
    });

    document.getElementById("loginBtn").addEventListener("click",()=>{
        const username=document.getElementById("loginUsername").value.trim();
        const password=document.getElementById("loginPassword").value.trim();
        if(!username||!password){alert("Isi semua field!");return;}
        if(checkUser(username,password)){
            localStorage.setItem("loggedUser",username);
            window.location.href="ai.html";
        }else{alert("Username atau password salah!");}
    });
}

// ===== CHAT AI =====
window.addEventListener("DOMContentLoaded",()=>{
    if(!document.getElementById("chatContainer")) return;

    const messagesEl=document.getElementById("messages");
    const userInput=document.getElementById("userInput");
    const sendBtn=document.getElementById("sendBtn");

    function appendMessage(text,sender){
        const div=document.createElement("div");
        div.className=`message ${sender}`;
        div.textContent=text;

        // context menu klik kanan / long press
        div.addEventListener("contextmenu",(e)=>{
            e.preventDefault();
            showMessageMenu(e.pageX,e.pageY,div);
        });

        let pressTimer;
        div.addEventListener("touchstart",(e)=>{
            pressTimer=setTimeout(()=>showMessageMenu(e.touches[0].pageX,e.touches[0].pageY,div),700);
        });
        div.addEventListener("touchend",()=>clearTimeout(pressTimer));

        messagesEl.appendChild(div);
        messagesEl.scrollTop=messagesEl.scrollHeight;
    }

    function showMessageMenu(x,y,messageDiv){
        const oldMenu=document.getElementById("msgMenu");
        if(oldMenu) oldMenu.remove();

        const menu=document.createElement("div");
        menu.id="msgMenu";
        menu.style.position="absolute";
        menu.style.top=y+"px";
        menu.style.left=x+"px";
        menu.style.background="#fffdf5";
        menu.style.border="1px solid #ffa500";
        menu.style.borderRadius="5px";
        menu.style.padding="5px";
        menu.style.zIndex=1000;

        const copyBtn=document.createElement("div");
        copyBtn.textContent="📋 Salin";
        copyBtn.style.padding="5px";
        copyBtn.style.cursor="pointer";
        copyBtn.addEventListener("click",()=>{
            navigator.clipboard.writeText(messageDiv.textContent);
            menu.remove();
            alert("Pesan disalin!");
        });

        const deleteBtn=document.createElement("div");
        deleteBtn.textContent="🗑️ Hapus";
        deleteBtn.style.padding="5px";
        deleteBtn.style.cursor="pointer";
        deleteBtn.addEventListener("click",()=>{
            messageDiv.remove();
            menu.remove();
        });

        menu.appendChild(copyBtn);
        menu.appendChild(deleteBtn);
        document.body.appendChild(menu);

        document.addEventListener("click",function handler(e){
            if(!menu.contains(e.target)){
                menu.remove();
                document.removeEventListener("click",handler);
            }
        });
    }

    function fetchInfoFromWeb(query){
        return new Promise(resolve=>{
            setTimeout(()=>resolve(`Ini informasi cepat tentang "${query}" 😎`),700);
        });
    }

    async function getAIResponse(message){
        const msg=message.toLowerCase().trim();
        if(msg==="hii"||msg==="hai"||msg==="hello") return "HII 👋";
        if(msg.includes("siapa penciptamu")||msg.includes("siapa yang membuatmu")) return "Aditya atau RevvNight 😎";
        if(msg.length<5){
            const jokes=["Haha lucu banget 😆","Wkwk bener juga 😄","Eh jangan gitu dong 😅"];
            return jokes[Math.floor(Math.random()*jokes.length)];
        }
        appendMessage("Sedang mencari informasi.... ⏳","ai");
        return await fetchInfoFromWeb(message);
    }

    async function sendMessage(){
        const msg=userInput.value.trim();
        if(!msg) return;
        appendMessage(msg,"user");
        userInput.value="";
        const reply=await getAIResponse(msg);
        appendMessage(reply,"ai");
    }

    sendBtn.addEventListener("click",sendMessage);
    userInput.addEventListener("keypress",(e)=>{if(e.key==="Enter") sendMessage();});
});
