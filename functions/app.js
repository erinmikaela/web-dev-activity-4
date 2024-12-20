const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// Serve static files from the public directory
app.use(express.static("public"));

// Serve the main index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Proxy route for champion data
app.get("/api/champions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://cdn.communitydragon.org/latest/champion/generic/square"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching champions:", error);
    res.status(500).json({ error: "Failed to fetch champions." });
  }
});

module.exports = app;
