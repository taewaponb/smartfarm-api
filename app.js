const express = require("express");
const app = express();

app.get("/welcome", (req, res) => {
  const { params } = req;
  res.json({ message: "Ahoy! This mean you can get a respond from our api!", params });
});

app.listen(9000, () => {
  console.log("Running on port 4000...");
});
