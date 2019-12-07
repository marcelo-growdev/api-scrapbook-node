const express = require("express");

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

//OBJECTS
const scraps = [];
let nextId = 1;

//ROUTES

server.get("/", (req, res) => {
    return res.json({result: "API-SCRAPBOOK"});
});

server.post("/scraps", (req, res) => {
    const { title, content } = req.body;
    const scrap = {id: nextId, title, content};

    scraps.push(scrap);

    nextId++;

    return res.json(scrap);
});

server.get("/scraps", (req, res) => {
    return res.json(scraps);
});

server.listen(3000);