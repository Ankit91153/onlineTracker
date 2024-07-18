const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Serve static files
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "views")));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("send-location", function(data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function(req, res) {
    const username = req.query.username || "Anonymous";
    res.render("index", { username });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
