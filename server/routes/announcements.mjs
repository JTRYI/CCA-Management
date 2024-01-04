import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
var secret = "secretkey";

const router = express.Router();

//Get Announcements
router.get("/announcements", async (req, res) => {

    try {

        let collection = await db.collection("announcements");
        let results = await collection.find({}).toArray();
        res.status(200).json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Getting Announcements" });
    }

});

//Add Announcements
router.post("/announcements/add/:token", async (req, res) => {
    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Add a Announcement" });
        }

        // Create a new user document
        let newDocument = {
            title: req.body.title,
            description: req.body.description,
        };

        // Insert the new announcement into the database
        let collection = await db.collection("announcements");
        let result = await collection.insertOne(newDocument);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Update Announcement
router.patch("/announcements/:token/:id", async (req, res) => {

    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Update a Announcement" });
        }

        const query = { _id: new ObjectId(req.params.id) };

        const updates = {
            $set: {
                title: req.body.title,
                description: req.body.description,
               
            }
        };

        let collection = await db.collection("announcements");
        let result = await collection.updateOne(query, updates);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

//Remove Announcement
router.delete("/announcements/:token/:id", async (req, res) => {

    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Remove a Announcement" });
        }

        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("announcements");
        let result = await collection.deleteOne(query);

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }


});

export default router