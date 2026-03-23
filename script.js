const ADMIN_PASSWORD = "ADITYA2789";

let currentUser = localStorage.getItem("user");

if(currentUser){
  showChat();
}

window.register = () => {
  let user = username.value;
  let pass = password.value;

  if(localStorage.getItem(user)){
    alert("Username sudah dipakai!");
    return;
  }

  localStorage.setItem(user, pass);
  alert("Berhasil daftar!");
};

window.login = () => {
  let user = username.value;
  let pass = password.value;

  if(localStorage.getItem(user) === pass){
    localStorage.setItem("user", user);
    showChat();
  } else {
    alert("Login gagal!");
  }
};

window.logout = () => {
  localStorage.removeItem("user");
  location.reload();
};

function showChat(){
  auth.style.display = "none";
  chatUI.style.display = "block";
}

window.send = () => {
  let text = input.value;
  chat.innerHTML += `<p>🧑 ${text}</p>`;

  let res = ai(text);
  chat.innerHTML += `<p>🤖 ${res}</p>`;
};

function ai(text){
  text = text.toLowerCase();

  if(text.includes("admin")){
    let pass = prompt("Password admin:");
    if(pass === ADMIN_PASSWORD){
      adminPanel.style.display = "block";
      return "Admin aktif 🔥";
    }
  }

  if(!text.includes("roblox")){
    return "Aku fokus Roblox, tapi tetap temenin kamu 😊";
  }

  if(text.includes("game")){
    return "Coba buat simulator atau tycoon 🔥";
  }

  if(text.includes("script")){
    return "Gunakan Lua biar optimal 🚀";
  }

  return "Menarik! Jelasin lagi ya 😊";
}

window.ban = () => {
  alert("Fitur ban aktif (basic)");
};

window.showImage = () => {
  let file = uploadImg.files[0];
  let url = URL.createObjectURL(file);
  chat.innerHTML += `<img src="${url}">`;
};

window.generateImage = () => {
  let img = new Image();
  img.src = "https://picsum.photos/200";

  img.onload = () => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Revan AI", 10, img.height - 10);

    let final = canvas.toDataURL();
    chat.innerHTML += `<img src="${final}">`;
  };
};
