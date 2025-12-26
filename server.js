// Load required libraries
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Create the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" })); // accept large JSON payloads for images
app.use(express.static("public")); // serve static files

// Endpoint to describe an uploaded image
app.post("/describe", async (req, res) => {
  const { imageBase64 } = req.body; // get base64 image from frontend

  if (!imageBase64) {
    return res.json({ description: "No image received." });
  }

  try {
    // Call Ollama's API instead of command line
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:7b",
        prompt: "Describe this image in detail.",
        images: [imageBase64], // Send base64 directly - no temp files needed!
        stream: false, // Get the full response at once
      }),
    });

    // Check if Ollama responded successfully
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Send the description back to the frontend
    res.json({ description: data.response });
  } catch (error) {
    console.error("Error:", error);
    res.json({ description: `Server error: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Fixed the syntax error here!
});
