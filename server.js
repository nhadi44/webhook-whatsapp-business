const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Gunakan PORT yang disediakan oleh Heroku atau fallback ke 3000 jika tidak ada

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.post("/webhook", (req, res) => {
  try {
    const body = req.body; // Mengambil body dari request
    console.log("Received POST request:", body);

    if (body.messages) {
      body.messages.forEach((message) => {
        console.log(`Message ID: ${message.id}`);
        console.log(`Status: ${message.status}`);
        console.log(
          `Timestamp: ${new Date(message.timestamp * 1000).toISOString()}`
        );
      });
    }

    res.json({ message: "Received POST request", data: body });
  } catch (error) {
    console.error("Error parsing request body:", error);
    res.status(400).json({ message: "Failed to parse request body" });
  }
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "secret";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Received GET request:", req.query, mode, token, challenge);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    console.error("Failed to verify webhook");
    res.status(403).json({ message: "Failed to verify webhook" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
