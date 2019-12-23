const express = require("express");
const app = express();

// app.get("/welcome", (req, res) => {
//   const { params } = req;
//   res.json({ message: "Ahoy! This mean you can get a respond from our api!", params });
// });

app.get('/welcome', (req, res) => res.end(`Welcome too.`));

app.get('/', (req, res) => res.end(`API is working fine.`));


app.listen(4000, () => {
  console.log("Running on port 4000...");
});
