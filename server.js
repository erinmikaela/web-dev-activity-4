const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Proxy route for champion data
app.get("/api/champions", async (req, res) => {
  try {
    const response = await axios.get("https://cdn.communitydragon.org/latest/champion/generic/square");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching champions:", error);
    res.status(500).json({ error: "Failed to fetch champions." });
  }
});

app.use(express.static("public"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
