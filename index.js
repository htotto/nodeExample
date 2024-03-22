const express = require('express');
const cors = require('cors');

const HHTP_Port = 8000;
console.log("Listening on port: " + HHTP_Port);
var app = express();
app.use(cors());

class Fruit {
    constructor(strname, strcolor) {
        this.name = strname;
        this.color = strcolor;
    }
}

var arrFruit = [];
let objBanana = new Fruit('banana','yellow')
let objApple = new Fruit('apple','red')
let objGrape = new Fruit('grape','purple')
arrFruit.push(objBanana);
arrFruit.push(objApple);
arrFruit.push(objGrape);
arrFruit.push(new Fruit('kiwi','green'));

app.get("/", (req, res, next) => {
    res.status(200).send(arrFruit);
});

app.post("/fruit", (req, res, next) => {
    let strName = req.query.name;
    let strColor = req.query.color;
    let objFruit = new Fruit(strName, strColor);
    arrFruit.push(objFruit);
    res.status(201).send(arrFruit);
});

app.get("/fruit", (req, res, next) => {
    let strName = req.query.name;
    if(strName){
        arrFruit.forEach(function(fruit){
            if(fruit.name == strName){
                res.status(200).send(fruit);
            }
        })
        res.status(200).send({message: "Fruit not found"})
    } else {
        res.status(200).send(arrFruit);
    }
});

app.delete("/fruit", (req, res, next) => {
    let strName = req.query.name;
    if(strName){
        arrFruit.forEach(function(fruit){
            if(fruit.name == strName){
                arrFruit.splice(arrFruit.indexOf(fruit), 1);
                res.status(200).send(fruit);
            }
        })
        res.status(200).send({message: "Fruit not found"})
    } else {
        arrFruit = [];
        res.status(200).send(arrFruit);
    }
});

app.get("/hello", (req, res, next) => {
    let strFruit = req.query.fruit;
    console.log("Routed to hello route");
    console.log(strFruit);

    res.status(200).send("Hello " + strFruit);
});

app.listen(HHTP_Port);