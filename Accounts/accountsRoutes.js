let express = require('express');
let knex = require('../data/dbConfig');
const { insert } = require('../data/dbConfig');
let router = express.Router();

router.get("/", (req, res) => {
    knex.select('*')
    .from('accounts')
    .then(accounts => {
        res.status(200).json({ data: accounts })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get("/:id", (req, res) => {
    let { id } = req.params
    knex.select('*')
    .from('accounts')
    .where({ id })
    .first() // gets first results from an array list
    .then(account => {
        res.status(200).json({ data: account })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post("/", (req, res) => {
    let newAccount = req.body;
    knex("accounts")
    .insert(newAccount)
    .into("accounts")
    .then(ids => {
        knex("accounts")
        .where({id: ids[0]})
        .first()
        .then(newAccount => {
            res.status(201).json({ data: newAccount })
        })
        .catch(err => {
            res.status(500).json({ error: "Could not process new account creation" })
        })
    })
})

router.put('/:id', (req, res) => {
    let { id } = req.params;
    let changes = req.body;
    knex("accounts")
    .where({ id })
    .update(changes) // returns 1 if successfully deleted account
    .then(count => {
        if(count > 0) {
            res.status(200).json(`Successfully updated account with id ${id}`)
        } else {
            res.status(404).json(`Could not find account with id ${id}`)
        }
    })
    .catch(err => {
        handleError(err, res)
    })
})

router.delete('/:id', (req, res) => {
    let { id } = req.params;

    knex("accounts")
    .where({id})
    .del() // returns 1 if successfully deleted account
    .then(count => {
        if(count > 0) {
        res.status(200).json(`Successfully deleted account with id ${id}`)
        } else {
            res.status(404).json(`Could not locate account to be deleted with id ${id}`)
        }
    })
    .catch(err => {
        handleError(err, res)
    })
})

function handleError(error, res) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
}


module.exports = router;