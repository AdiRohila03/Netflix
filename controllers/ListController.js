const listschema = require('../models/ListModel');

//CREATE
const create = async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new listschema(req.body);
        try {
            const savedList = await newList.save();
            res.status(201).json(savedList);
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
            await listschema.findByIdAndDelete(req.params);
            res.status(201).json(" List has been Deleted! ");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Not Allowed!")
    }
}

//GET
const get = async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {                          //Select movie/series list
            if (genreQuery) {
                list = await listschema.aggregate([
                    { $match: { type: typeQuery, genre: genreQuery } },
                    { $sample: { size: 5 } }]);
            } else {
                list = await listschema.aggregate([
                    { $match: { type: typeQuery } },
                    { $sample: { size: 5 } }]);
            }
        } else {                               //Displays random movie/series on the home pg
            list = await listschema.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { create, remove, get }