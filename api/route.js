const express = require('express');
const routes = express.Router();
let Registration = require('./schema/User');
let RouteNames = require("./constants/constants");

routes.get('/', (req, res) => {
    res.send('Success');
})

routes.route(RouteNames.register).post(function (req, res) {
    let register = new Registration(req.body);
    register.save()
        .then(reg => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(400).send("Failed to store to database");
        });
});

routes.route(RouteNames.deleteEntry).delete((req, res) => {
    Registration.remove({_id: req.params.id}, (err) => {
        if (err)
            res.status(400).send("Failed to delete");
        res.status(200).send('Deleted');
    })
})


routes.route(RouteNames.edit).put((req, res) => {
    Registration.findOneAndUpdate({_id: req.body._id}, req.body, (err) => {
        if (err)
            res.status(400).send("Failed to update");
        res.status(200).send('Updated Successfully');
    })
})

routes.route(RouteNames.data).get(function (req, res) {
    Registration.find((err, data) => err ? res.status(400).send("Error occured") : res.json(data));
});

module.exports = routes;
