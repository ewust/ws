


sock = new WebSocket("wss://ws-dev.refraction.network/test-websocket")


sock.onmessage = (event) => {
    console.log(event.data.length + ' bytes: ' + event.data);
};

sock.send("Hello world");
