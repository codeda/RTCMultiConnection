// Muaz Khan      - www.MuazKhan.com
// MIT License    - www.WebRTC-Experiment.com/licence
// Documentation  - github.com/muaz-khan/RTCMultiConnection

var express = require("express"),
    http = require("http"),
    app = express(),
    server = http.createServer(app);

require('./Signaling-Server.js')(server, function(socket) {
    try {
        var params = socket.handshake.query;

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    } catch (e) {}
});

app.set('view engine', 'pug');
server.listen(9001);
console.log('Server listen on :9001');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.get("/", function(req, res){
    var roomName = '';
    var error = '';
    if (req.query.roomName) {
        roomName = req.query.roomName; 
    } else {
        error = "No room name provided";
    }
    res.render("index", {error: error, roomName: roomName });
});

