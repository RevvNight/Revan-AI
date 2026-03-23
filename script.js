// Ambil bahasa dari login
let userLang = localStorage.getItem("userLang") || "en";

// Simulasi pencarian info
function fetchInfoFromWeb(query) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Ini informasi yang aku temukan tentang "${query}"`);
        }, 1500);
    });
}

// Translate pakai LibreTranslate API
async function translateToUser(text, targetLang) {
    if(targetLang === "en") return text;
    try {
        const res = await fetch('https://libretranslate.com/translate', {
            method:'POST',
            body: JSON.stringify({q: text, source: 'en', target: targetLang}),
            headers: {'Content-Type':'application/json'}
        });
        const data = await res.json();
        return data.translatedText;
    } catch(e){
        return text;
    }
}

// Fungsi AI
async function getAIResponse(message) {
    const msg = message.toLowerCase().trim();

    // salam cepat
    if (msg === "hii" || msg === "hai" || msg === "hello") {
        return await translateToUser("HII", userLang);
    }

    // pertanyaan pencipta
    if (msg.includes("siapa penciptamu") || msg.includes("siapa yang membuatmu")) {
        return await translateToUser("Aditya atau RevvNight", userLang);
    }

    // pertanyaan pendek / receh
    if (msg.length < 5) {
        const jokes = [
            "Haha lucu banget!",
            "Wkwk bener juga 😆",
            "Eh jangan gitu dong 😅"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        return await translateToUser(joke, userLang);
    }

    // pertanyaan info
    appendMessage(await translateToUser("Sedang mencari informasi....", userLang), "ai");
    const result = await fetchInfoFromWeb(message);
    return await translateToUser(result, userLang);
}

// Tambah pesan ke chat
function appendMessage(text, sender) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Event send button
document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if(!message) return;
    appendMessage(message, "user");
    input.value = "";

    const reply = await getAIResponse(message);
    appendMessage(reply, "ai");
});

// Enter key
document.getElementById("userInput").addEventListener("keypress", async (e) => {
    if(e.key === "Enter") document.getElementById("sendBtn").click();
});
