import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var secret = "secretkey";

const router = express.Router();

//Login
router.post("/login", async (req, res) => {
    const { isAdmin, email, password } = req.body;

    try {
        // find user in "users" collection from MongoDB
        const user = await db.collection("users").findOne({ email });

        //if user not found
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Check if the selected role matches the user's role
        if ((isAdmin && user.isAdmin) || (!isAdmin && !user.isAdmin)) {
            // If the password is correct and the role matches, generate a token
            const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, secret);

            // Send the token in the response
            res.json({ token });

        } else {
            return res.status(403).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

// Get User Only
router.get("/user/:token", async (req, res) => {
    let collection = await db.collection("users");

    const token = req.params.token;

    try {
        const decodedToken = jwt.verify(token, secret);

        // Ensure the decodedToken has the userId property
        const userID = decodedToken.userId;

        let query = { _id: new ObjectId(userID) };
        let result = await collection.findOne(query);

        if (!result) {
            res.status(404).json({ message: "User Not Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        // Handle invalid token or other verification errors
        console.error(error);
        res.status(401).json({ message: "Invalid Token" });
    }
});

// Get all Members
router.get("/members", async (req, res) => {

    try {

        let collection = await db.collection("users");
        let results = await collection.find({ isAdmin: false }).toArray();
        res.status(200).json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Getting Members" });
    }

});

// Add Member
router.post("/member/add/:token", async (req, res) => {
    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Add a Member" });
        }

        // Check if the email already exists
        const existingUser = await db.collection("users").findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email Already in Use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user document
        let newDocument = {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            isAdmin: false,
            instrument: req.body.instrument,
            yearOfStudy: req.body.yearOfStudy,
            profilePic: req.body.profilePic,
            dateJoined: new Date().toLocaleDateString('en-GB').split('/').join('-')  // Format: "DD-MM-YYYY"
        };

        // Insert the new user into the database
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Get Member by ID
router.get("/member/:id", async (req, res) => {

    let collection = await db.collection("users");

    try {
        let query = { _id: new ObjectId(req.params.id) };
        let result = await collection.findOne(query);

        if (!result) {
            res.status(404).json({ message: "Member Not Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
    }

});

//Update Member
router.patch("/member/:token/:id", async (req, res) => {

    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Update a Member" });
        }

        const query = { _id: new ObjectId(req.params.id) };

        // Check if the updated email already exists
        const emailExists = await db.collection("users").findOne({ email: req.body.email });

        if (emailExists && emailExists._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        const updates = {
            $set: {
                email: req.body.email,
                name: req.body.name,
                instrument: req.body.instrument,
                yearOfStudy: req.body.yearOfStudy,
                profilePic: req.body.profilePic,
            }
        };

        let collection = await db.collection("users");
        let result = await collection.updateOne(query, updates);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

//Remove Member
router.delete("/member/:token/:id", async (req, res) => {

    try {

        const decodedToken = jwt.verify(req.params.token, secret);

        if (decodedToken.isAdmin == false) {
            return res.status(400).json({ message: "You are not Authorized to Remove a Member" });
        }

        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("users");
        let result = await collection.deleteOne(query);

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }


});

export default router