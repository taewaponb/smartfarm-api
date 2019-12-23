const express = require("express");
const app = express();

// app.get('/', (req, res) => res.end(`API is working fine.`));

app.listen(4000, () => {
  console.log("Running on port 4000...");
});
