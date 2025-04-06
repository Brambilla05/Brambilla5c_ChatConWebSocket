import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js";
const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const usernameButton = document.getElementById("usernameButton");
const userListElement = document.getElementById("userList");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];
const socket = io();

usernameModal.style.display = "block";

usernameButton.onclick = () => {
    const username = usernameInput.value;
    if (username) {
        socket.emit("isLogged", username);
    }
};

input.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
};

button.onclick = () => {
    socket.emit("message", input.value);
    input.value = "";
};

socket.on("chat", (message) => {
    messages.push(message);
    render();
});

socket.on("list", (userList) => {
    userListElement.innerHTML = ""; 
    userList.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.name;
        userListElement.appendChild(li);
    });
});

const render = () => {
    let html = "";
    messages.forEach((message) => {
        const row = template.replace("%MESSAGE", message);
        html += row;
    });
    chat.innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
};