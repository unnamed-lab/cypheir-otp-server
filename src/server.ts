const express = require("express");

const app = express();
const PORT = 3000;


app.use("/api/", require('./routes/codes'))

app.listen(PORT, (): void => {
    console.log(`The server is running on ${PORT}`);
})

export = {}