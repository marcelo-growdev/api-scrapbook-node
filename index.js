const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

function checkScrap(req, res, next) {
    const {id} = req.params;
    const scrap = scraps.find(scrap => scrap.id == id);

    if(!scrap) {
        return res.json({error: "Scrap not found."});
    }

    next();
};

let nextId = 1;
const scraps = [];

//ROUTES
server.get("/", (req, res) => {
    return res.json({result: "API-SCRAPBOOK"});
});

server.get("/scraps", (req, res) => {
    return res.json(scraps);
});

server.post("/scraps", (req, res) => {
    const {title, content} = req.body;
    const scrap = {
        id: nextId,
        title,
        content
    };

    scraps.push(scrap);

    nextId++;
    
    return res.json(scrap);
});

server.put("/scraps/:id", checkScrap, (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;

    const scrap = scraps.find(scrap => scrap.id == id);

    if(title) {
        scrap.title = title;
    }

    if(content) {
        scrap.content = content;
    }

    return res.json(scrap);

});

server.delete("/scraps/:id", checkScrap, (req, res) => {
    const {id} = req.body;

    const scrapIndex = scraps.findIndex(scrap => scrap.id == id);

    scraps.splice(scrapIndex, 1);

    res.json(scraps);
});


server.listen(3333);