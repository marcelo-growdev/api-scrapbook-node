const express = require('express');
const database = require('./database');

require('dotenv').config();

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//MIDDLEWARES
function checkScrap(req, res, next) {
    const {id} = req.params;
    const scrap = scraps.find(scrap => scrap.id == id);

    if(!scrap) {
        return res.json({error: "Scrap not found."});
    }

    next();
};

async function getNextId(req, res, next) {
    await database.query(`SELECT MAX(id) FROM scraps`, { type: database.QueryTypes.SELECT})
        .then(id => {
            nextId = id[0].max;
        });
    
    next();
}

let nextId = null;
let scraps = [];

//ROUTES
server.get("/", (req, res) => {
    return res.json({result: "API-SCRAPBOOK"});
});

server.get("/scraps", (req, res) => {
    database.query(`SELECT * FROM scraps`, { type: database.QueryTypes.SELECT})
        .then(cards => {
            scraps = cards;
        });

    return res.json(scraps);
});

server.post("/scraps", getNextId, (req, res) => {
    nextId++;

    const {title, content} = req.body;
    const scrap = {
        id: nextId,
        title,
        content
    };

    database.query(`INSERT INTO scraps ("id", "title", "content") VALUES (${nextId}, '${title}', '${content}');`,
        { type: database.QueryTypes.INSERT}
    )
    .then(insert => {
        console.log(insert);
    });

    scraps.push(scrap);

    return res.json(scrap);
});

server.put("/scraps/:id", checkScrap, (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
    let updated = false;

    const scrap = scraps.find(scrap => scrap.id == id);

    if(title) {
        scrap.title = title;
        updated = true;
    }

    if(content) {
        scrap.content = content;
        updated = true;
    }

    if(updated) {
        database.query(`UPDATE scraps SET content = '${scrap.content}', title = '${scrap.title}' WHERE  id = ${id}`,
            { type: database.QueryTypes.UPDATE}
        )
        .then(update => {
            console.log(update);
        });
    };

    return res.json(scrap);

});

server.delete("/scraps/:id", checkScrap, (req, res) => {
    const {id} = req.params;

    const scrapIndex = scraps.findIndex(scrap => scrap.id == id);

    database.query(`DELETE FROM scraps WHERE id = ${id};`, { type: database.QueryTypes.DELETE})
    .then(del => {
        console.log(del);
    });

    scraps.splice(scrapIndex, 1);

    res.json(scraps);
});


server.listen(process.env.PORT);