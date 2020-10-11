function appendToContent(text) {
  let element = document.createElement('p');
  element.innerText = text;
  document.getElementById('content').appendChild(element);
}

const socket = io();

socket.on('connect', () => {
  appendToContent('Established socket connection');
})

socket.on('message', msg => {
  appendToContent(msg);
})
