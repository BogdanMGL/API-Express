const express = require("express");
const { calculation, lang } = require("./file")

const app = express();
app.use(express.json())

app.put("/calculation", function(req, res) {
    const data = req.body;
    const { characters, language, formatFile } = data;
    console.log(req.body);
    if (lang.indexOf(data.language) === -1) {
        res.status(400).send(JSON.stringify({ ERROR: "The language is not correct, please enter it in this format: rus , ukr , eng" }));
    } else if (characters <= 0) {
        res.status(400).send(JSON.stringify({ ERROR: "Characters must be larger 0 " }));
    } else if (typeof formatFile !== "boolean") {
        res.status(400).send(JSON.stringify({ ERROR: "The file format must be specified in boolean form" }));
    } else {
        const result = calculation(characters, language, formatFile);
        result.deadline = new Date(result.deadline).toLocaleString();
        res.status(200).send(JSON.stringify(result))
    }
})

app.listen(3000, function() {
    console.log('Ready')
});
