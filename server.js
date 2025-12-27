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
    console.log("Sending image to Ollama...");
    // Call Ollama's API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:13b", // updated the model
        prompt:
          "Analyze this image carefully. Describe everything you observe: the main subjects, their actions, the environment, colors, lighting, any visible text or symbols, spatial relationships between objects, and the overall atmosphere or purpose of the image.",
        images: [imageBase64], // send base64 directly
        stream: false, // get the full response at once
      }),
    });

    console.log("Ollama responded with status:", response.status); // see if it worked

    // Check if Ollama responded successfully
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama error details:", errorText); // show what went wrong
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Got description from Ollama!"); // success!

    // Send the description back to the frontend
    res.json({ description: data.response });
  } catch (error) {
    console.error("Error:", error);
    res.json({ description: `Server error: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // fixed syntax
});
