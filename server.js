const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const pug = require('pug')

const mongoClient = new MongoClient("mongodb+srv://root:hoRYEGRpiQFNH46u@cluster0.cfp4c.mongodb.net/");

app.use('/src', express.static('public'));

const PORT = process.env.PORT || 3001;

mongoClient.connect((err, client)=> {
    app.get('/', (req, res) => {
        if (err)
            console.log(err)

        const db = client.db("Aliexpress");
        const collection = db.collection("cards");
        let cards = Array();
        collection
            .find({})
            .limit(20)
            .forEach((card)=>{
                cards.push(card);
            }).then(()=>{
                const compiledFunction = pug.compileFile('./view/index.pug');
                res.send(compiledFunction({
                    cards: JSON.stringify(cards)
                }));
            });
    });
    app.listen(PORT, () => {
        console.log(``);
    });
});