// const fs = require('fs');

// fs.readdir("Carts", function(err, files_names) {
//     files_names.forEach((file_name)=>{
//         let rawdata = fs.readFileSync("Carts/"+file_name);
//         let data = JSON.parse(rawdata);
//         let characters = [];
//         data["title"] = data["title"].substr(15)
//         if(data["colors"])
//             for (let key in data["colors"][0]){
//                 // console.log(key)
//                 if(key=="#background: whit"){
//                     let id = data["colors"][0][key]
//                     delete data["colors"][0][key]
//                     data["colors"][0]["#ffffff"] = id
//                 }
//             }
//
//         if(data["modifications"])
//             if(Object.keys(data["modifications"][0]).length === 0)
//                 delete data["modifications"];
//             else{
//                 let modifications = []
//                 for (let key in data["modifications"][0]) {
//                     modifications.push({
//                         "name": key,
//                         "colors": Object.values(data["modifications"][0][key])[0]
//                     })
//                 }
//                 data["modifications"] = modifications
//             }
//         for (let key in data["characters"]) {
//             for (let i = 0; i < data["characters"][key].length; i++) {
//                 data["characters"][key][i] = {
//                     "name": Object.keys(data["characters"][key][i])[0],
//                     "value": Object.values(data["characters"][key][i])[0]
//                 }
//             }
//             characters.push({"name": key, "value": data["characters"][key]})
//         }
//         data["characters"] = characters;
//         console.log(data)
//         data = JSON.stringify(data)
//         fs.writeFile("Carts_new/"+file_name, data, 'utf-8', ()=>{})
//     })
// });

const fs = require('fs');
const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://root:hoRYEGRpiQFNH46u@cluster0.cfp4c.mongodb.net/";


fs.readdir("carts", function(err, items) {
    MongoClient.connect( url,  {useUnifiedTopology: true, useNewUrlParser: true}, function( err, client ) {
        db = client.db('Aliexpress');
        const cards = db.collection("cards");
        let cnt = 1;
        for (let key in items) {
            fs.readdir("carts/"+items[key], function (err, imgs) {
                img_len = imgs.length
                if(img_len)
                    cards
                        .updateOne(
                            {"id": items[key]},
                            {$set: {"img_len": img_len}}
                        )
                else
                    cards
                        .deleteOne(
                            {"id": items[key]}
                        )
                console.log(items[key], img_len, cnt++)
            })
        }
    })
})