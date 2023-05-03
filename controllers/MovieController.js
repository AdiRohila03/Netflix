const movieschema = require('../models/MovieModel');

//CREATE
const create = async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new movieschema(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Not Allowed!")
    }
}

//UPDATE
const update = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await movieschema.findByIdAndUpdate(req.params,
                {
                    $set: req.body
                },
                { new: true }
            );
            res.status(200).json(updatedMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Not Allowed!")
    }
}

//DELETE
const remove = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await movieschema.findByIdAndDelete(req.params);
            res.status(200).json("Movie has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Not Allowed!")
    }
}

//GET
const get = async (req, res) => {
    try {
        const movie = await movieschema.findById(req.params);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
}

//For showcasing a movie/series randomly on the interface.
//GET RANDOM
const random = async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await movieschema.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ]);
        } else {
            movie = await movieschema.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
}

//GET ALL
const all = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movie = await movieschema.find();
            res.status(200).json(movie.reverse());  //reverse() for latest movies/series
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Not Allowed!")
    }
}

module.exports = { create, update, remove, get, random, all }