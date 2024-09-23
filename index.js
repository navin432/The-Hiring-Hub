const express = require("express");
const app = express();

// Routes
app.use(express.static("public"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
