

// List of target lengths, negative for server, positive for client
// Requirements:
//  first length must be at least 585 (+extra to encode server lengths)
//  second length must be negative and at least -270 (currently ignored; TODO: adjust server's HTTP response)
//  TODO(bug): 300 length below is showing up as 305 on wire, all others correct. Why?
var lens = [600, -300, 100, -200, 300, -400, -500, 600];

// Setup button
window.onload = () => {
btn = document.createElement('button');
btn.innerText = 'Click to run test';
btn.addEventListener('click', () => { test_ws(lens); });
document.body.appendChild(btn);
}


// Test websockets (on button press)
function test_ws(lens) {
    val = lens.shift()
    if (val < 0) {
        console.log("Error: can't have first value be server (need to send request)");
        return;
    } else if (val < 585) { 
        console.log("Error: can't have first value less than 585 bytes (request too long)")
        return;
    }

    // Load up server lengths
    server_lens = Array()
    var i = 0;
    while (lens[i] < 0) {
        server_lens.push(-lens[i++]);
    }
    x = server_lens.join('x')

    pad_length = val - (585 + x.length)
    if (pad_length < 0) {
        console.log("Error: first value too short");
        return;
    }
    x += 'x'.repeat(pad_length);

    sock = new WebSocket("wss://ws-dev.refraction.network/ws/" + x);    // 585 +x


    function send(n) {
        var i=0;
        server_lens = Array()
        while (lens[i] < 0) {
            server_lens.push(-lens[i++]);
        }
        x = server_lens.join('x');

        pad_len = n - (25 + server_lens.length);
        if (pad_len < 0) {
            console.log("Error: trying to send " + (23+server_lens.length) + ", only have room for " + n);
        } else {
            x += 'x'.repeat(pad_len);
        }
        sock.send(x);
    }


    sock.onmessage = (event) => {
        console.log(event.data.length + ' bytes: ' + event.data + ' removing ' + lens.shift());

        while (lens[0] > 0) {
            send(lens.shift());
        }
    };

    sock.onopen = (event) => {
        // Eat the first server response (regardless of length)
        lens.shift();

        while (lens[0] > 0) {
            send(lens.shift());
        }
    };
}
