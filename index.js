const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "node.db";
const db = new sqlite3.Database(dbSource);

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

let strID = uuidv4();
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
    let strCommand = "INSERT INTO tblFRUIT (name, color) VALUES (?,?)";
    if(strName && strColor){
        let arrParameters = [strName, strColor];
        let objFruit = new Fruit(strName, strColor);
        db.run(strCommand, arrParameters, function(error, result){
            if(error){
                res.status(400).json({error: error.message});
            } else {
                res.status(201).json({message: "success", fruit: objFruit})
            }
        })
    } else {
        res.status(400).json({error: "Not all parameters provided"})
    }
    
});

app.get("/fruit/:name", (req, res, next) => {
    let strName = req.params.name;
    if(strName){
        let strCommand = "SELECT * FROM tblFRUIT WHERE name = ?";
        let arrParameters = [strName];
        db.all(strCommand,arrParameters,(err, rows) => {
            if(err){
                res.status(400).json({error:err.message});
            } else {
                if(rows.length < 1){
                    res.status(200).json({message: "error: not found"});
                } else {
                    res.status(200).json({message: "success", fruit:rows});
                }
            }
        })
    } else {
        res.status(400).json({error: "No fruit name provided"});
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
    let strCommand = 'SELECT * FROM tblFRUIT';
    db.all(strCommand, (err, rows) => {
        if(err){
            res.status(400).json({error:err.message});
        } else {
            res.status(200).json({message: "success", fruit:rows});
        }
    });
});

app.listen(HHTP_Port);