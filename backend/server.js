require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URL;

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true }
})

const Url = mongoose.model('Url', urlSchema);

// shorten API para encurtar URLs
app.post("/api/shorten", async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const shortUrl = shortid.generate();
        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();
        res.status(201).json({ originalUrl, shortUrl });
    } catch (error) {
        console.error('Failed to save shortened URL:', error);
        res.status(503).json({ message: "Database unavailable. Please try again shortly." });
    }
});

// Redirect API para redirecionar URLs encurtadas
app.get("/:shortUrl", async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });

        if (url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).json({ message: "URL not found" });
        }
    } catch (error) {
        console.error('Failed to retrieve shortened URL:', error);
        res.status(503).json({ message: "Database unavailable. Please try again shortly." });
    }
});

async function startServer() {
    await mongoose.connect(mongoUri);
    app.listen(3000, () => {
        console.log(`Server is running on port ${3000}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
});