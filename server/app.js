const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const fs = require('fs')
const bcrypt = require("bcrypt")
const colors = require('colors')
const expressJWT = require("express-jwt")
const cors = require('cors')


const magicManager = express()


const secrets = JSON.parse(fs.readFileSync('secrets.json'))

const Card = require('./models/card');
const User = require('./models/user');
const Deck = require('./models/deck');



magicManager.use(bodyParser.json())
magicManager.use(cors())




function checkRegistryData(name, email, password) {

    let nameCorrect = validateName(name);
    let emailCorrect = validateEmail(email);
    let passwordCorrect = validatePassword(password);

    if (!emailCorrect || !nameCorrect || !passwordCorrect) {
        return false;
    } else {
        return true;
    }

}

function validatePassword(password) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(password)) {
        return (true)
    } else {
        return (false)
    }
}

function validateName(name) {
    if (/^(?=.{8,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/.test(name)) {
        return (true)
    } else {
        return (false)
    }
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    } else {
        return (false)
    }
}




mongoose.connect(`mongodb+srv://Eric:${secrets["atlas"]}@fullstack-projects-1ciwb.mongodb.net/MagicManager`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {

    // console.log("Estoy conectado a mongoDB a través de Mongoose".green)

    //GET ALL CARDS
    magicManager.post("/cards", (req, res) => {
        //si dejamos en blanco (no añadimos) el campo de la query en el 'find', busca todos los resultados
        // console.log(req.body)
        Card.find(req.body, (err, data) => {
            if (err) throw err
            res.send({
                "status": "OK",
                "data": data
            })
        })
    })


    //CREATE A DECK
    magicManager.post("/deck", (req, res) => {
        // console.log("got a POST at '/deck'".yellow)
        User.find({
            "_id": req.body.creator["_id"]
        }, (err, userData) => {
            if (userData.length == 0) {
                //usuario no existe, no debería pasar si no se manipula la BBDD directamente
            } else {
                let sameNameDeck = false
                for (let i = 0; i < userData[0]["createdDecks"].length; i++) {
                    if (req.body.name == userData[0]["createdDecks"][i]["name"]) {
                        sameNameDeck = true;
                    }
                }
                if (sameNameDeck) {
                    // deck already exists
                    res.send({
                        "status": "Error",
                        "message": "You already have a deck with the same name. Please choose a different one."
                    })
                } else {
                    //new deck
                    let creationDate = new Date
                    let newDeck = new Deck({
                        "_id": mongoose.Types.ObjectId(),
                        "name": req.body.name,
                        "cards": req.body.cards,
                        "creationDate": creationDate,
                        "updateDate": creationDate,
                        "public": req.body.public,
                        "creator": req.body.creator
                    });
                    newDeck.save((err) => {
                        if (err) throw err
                        // console.log("Saved deck!")
                        userData[0]["createdDecks"].push(newDeck);
                        userData[0].save((err) => {
                            res.send({
                                "status": "OK",
                                "message": "Deck added successfully and user updated",
                                "deck": newDeck
                            })
                        })
                        //Para devolver los datos de usuario (para el token) sin el hash del password

                    });

                }
            }
        })


    })

    //GET A DECK
    magicManager.get("/deck/:id", (req, res) => {
        // console.log("got a GET at '/deck'".yellow)

        Deck.findOne({
                "_id": req.params.id
            },
            (err, data) => {
                if (err) throw err;
                if (data == null) {
                    res.send({
                        "status": "Error",
                        "message": "No deck with that ID exists"
                    })
                } else {
                    res.send({
                        "status": "OK",
                        "message": "Deck added successfully",
                        "deck": data
                    })
                }
            })
    })

    //GET ALL PUBLIC DECKS

    magicManager.get("/public-decks", (req, res) => {
        Deck.find({
            "public": true
        }, (err, data) => {
            if (err) throw err;
            if (data.length == 0) {
                res.send({
                    "status": "Error",
                    "message": "No public decks in the DB"
                })
            } else {
                res.send({
                    "status": "OK",
                    "message": "Public decks accessed successfully",
                    "data": data
                })
            }
        })
    })

    // UPDATE A DECK

    magicManager.put("/deck", (req, res) => {
        Deck.findOne({
                "_id": req.body._id
            },
            (err, deckData) => {
                if (err) throw err;
                if (deckData.length == 0) {
                    res.send({
                        "status": "Error",
                        "message": "No deck with that ID exists"
                    })
                } else {
                    let keys = Object.keys(req.body)
                    for (let i = 0; i < keys.length; i++) {
                        deckData[keys[i]] = req.body[keys[i]]
                    }
                    deckData["updateDate"] = new Date

                    deckData.save((err) => {
                        if (err) throw err
                        User.findOne({
                            "_id": deckData["creator"]["_id"]
                        }, (err, userData) => {
                            if (err) throw err
                            for (let i = 0; i < userData["createdDecks"].length; i++) {
                                if (userData["createdDecks"][i]["_id"] == deckData["_id"]) {
                                    userData["createdDecks"][i] = deckData;
                                }
                            }
                            userData.save((err) => {
                                res.send({
                                    "status": "OK",
                                    "message": "Deck and user updated successfully",
                                    "deck": deckData
                                })
                            })

                        })

                    })

                }
            })
    })

    // DELETE A DECK

    magicManager.delete("/deck/:id", (req, res) => {
        let ids = req.params.id.split("-");
        let deckID = ids[0]
        let userID = ids[1]

        Deck.findOneAndDelete({
            "_id": deckID
        }, (err) => {
            if (err) throw err
            User.findOne({
                "_id": userID
            }, (err, userData) => {
                if (err) throw err;

                for (let i = 0; i < userData["createdDecks"].length; i++) {
                    if (userData["createdDecks"][i]["_id"] == deckID) {
                        userData["createdDecks"].splice(i, 1)
                        i = userData["createdDecks"].length
                    }
                }
                userData.save((err) => {
                    if (err) throw err;
                    res.send({
                        "status": "OK",
                        "message": "Deck deleted and user updated successfully"
                    })
                })
            })


        })
    })

    //LOGIN
    magicManager.post('/login', (req, res) => {
        // console.log("he recibido post en /login".yellow)

        if (req.body.email != null && req.body.password != null) {
            User.find({
                "email": req.body.email
            }, (err, data) => {
                if (data.length == 0) {
                    res.send({
                        "status": "Error",
                        "message": "No existe ningún usuario con ese email"
                    })
                } else {
                    bcrypt.compare(req.body["password"], data[0]["password"], (err, result) => {
                        if (!result) {
                            res.send({
                                "status": "Error",
                                "message": "Email or password incorrect"
                            })

                        } else {
                            jwt.sign({
                                "username": req.body["email"]
                            }, secrets["jwt_clave"], (err, token) => {
                                if (err) throw err;
                                // console.log("Login correct".green)
                                res.send({
                                    "status": "OK",
                                    "message": "Login correct",
                                    "token": token,
                                    "userId": data[0]["_id"],
                                    "email": data[0]["email"],
                                    "user": data[0]
                                })
                            })
                        }
                    })
                }
            })
        } else {
            res.send({
                "status": "Error",
                "message": "Missing params"
            })
        }
    })



    //REGISTER
    magicManager.post("/register", (req, res) => {
            //creamos un nuevo objecto usando el modelo creado antes
            console.log("he recibido post en /register".yellow)
            // if (req.body.name != null && req.body.email != null && req.body.password != null) {

            //comprobamos que los datos introducidos son correctos
            if (checkRegistryData(req.body.name, req.body.email, req.body.password)) {
                User.find({
                    "email": req.body.email
                }, (err, data) => {
                    if (data.length == 0) {
                        bcrypt.hash(req.body["password"], 13, (err, hash) => {

                            let newUser = new User({
                                "_id": mongoose.Types.ObjectId(),
                                "name": req.body.name,
                                "email": req.body.email,
                                "password": hash,
                                "profileImage": req.body.profileImage,
                                "creationDate": new Date /* currentTime() */
                            })
                            newUser.save((err) => {
                                if (err) throw err
                                // console.log("USer Saved!")
                                //Para devolver los datos de usuario (para el token) sin el hash del password
                                delete newUser.password;
                                res.send({
                                    "status": "OK",
                                    "message": "Usuario añadido correctamente",
                                    "userData": newUser
                                })
                            });
                        })
                    } else {
                        res.send({
                            "status": "Error",
                            "message": "Ya existe un usuario con ese email"
                        })
                    }
                })
            } else {
                res.send({
                    "status": "Error",
                    "message": "Missing parameters"
                })
            }
        })


        //GET ALL USERS + FAVOURITES

        magicManager.get("/favourites", (req, res) => {
            //si dejamos en blanco (no añadimos) el campo de la query en el 'find', busca todos los resultados
            User.find((err, allUsers) => {
                if (err) throw err
                if (allUsers.length == 0) {
                    res.send({
                        "status": "Error",
                        "message": "No users in DB"
                    })
                } else {
                    let favourites = [];
                    for (let i = 0; i < allUsers.length; i++) {
                        for (let j = 0; j < allUsers[i]["favouriteCards"].length; j++) {
                            let alreadyInFavs = false;
                            for (let k = 0; k < favourites.length; k++) {
                                if (favourites[k]["_id"] == allUsers[i]["favouriteCards"][j]["_id"]) {
                                    alreadyInFavs = true;
                                    break
                                }
                            }
                            if (!alreadyInFavs){
                                favourites.push(allUsers[i]["favouriteCards"][j])
                            }
                        }
                    }
                    res.send({
                        "status": "OK",
                        "message": "All favourites accessed successfully",
                        "favourites": favourites
                    })
                }

            })
        })

    //GET SINGLE USER
    magicManager.get("/user/:id", (req, res) => {
        // console.log("received GET at /user/" + req.params.id)
        User.find({
            _id: req.params.id
        }, (err, data) => {
            // console.log("userID after search:", req.params.id)
            // console.log("userdata", data)
            res.send(data)
        })
    })

    //UPDATE USER

    magicManager.put("/users", (req, res) => {
        // console.log(`received PUT on /users with body: ${req.body}`.red)
        let query = {
            _id: req.body["_id"]
        };
        let datosFinales = {}
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            datosFinales[Object.keys(req.body)[i]] = req.body[Object.keys(req.body)[i]]
        }
        // console.log(datosFinales)
        /*         datosFinales = {
                "_id": req.body.id,
                "name": req.body.name,
                "email": req.body.email,
            }; */
        // console.log(datosFinales)
        let changes = {
            $set: datosFinales
        };
        // console.log("changes:", changes)

        let options = {
            multi: true
        }

        User.updateOne(query, changes, options, (err, log) => {
            if (err) throw err
            // console.log(log)
            res.send(log)
            //el objeto modificado lo tenemos en "datosFinales"
        })
    })


    magicManager.listen(3000, () => {
        console.log("Escuchando por el puerto 3000")
    })



})