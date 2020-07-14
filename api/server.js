const express = require("express");
let accountsRoutes = require('../Accounts/accountsRoutes')

const db = require("../data/dbConfig.js");

const server = express();
server.use(express.json());

server.use('/api/actions', accountsRoutes)
server.use('/api', (req, res) => {
    res.status(200).json({ api: "UP" })
})


module.exports = server;
    