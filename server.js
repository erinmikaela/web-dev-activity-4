// Import required modules
const express = require("express");
const path = require("path");

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// API endpoint example (optional for dynamic data)
app.get("/api/data", (req, res) => {
  res.json({ message: "Welcome to the Wild Rift API!", status: "success" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
