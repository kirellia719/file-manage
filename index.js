const express = require("express");
const app = express();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

app.post("/fileupload", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        var oldpath = files.filetoupload.filepath;
        var newpath = path.join(__dirname, "sources", files.filetoupload.originalFilename);
        fs.readFile(oldpath, function (err, data) {
            if (err) res.status(500).send(err);
            // Write the file
            fs.writeFile(newpath, data, function (err) {
                if (err) res.status(500).json(err);
                res.json('File uploaded and moved!');
            });
        });
    })
});

app.get("/file/:filename", (req, res) => {
    var filename = req.params.filename;
    fs.readFile(path.join(__dirname, "sources", filename), (err, data) => {
        if (err) res.status(404).send("File not found");
        res.sendFile(path.join(__dirname, "sources", filename))
    })
});

app.put("/file/:filename/:newname", (req, res) => {
    var { filename, newname } = req.params;
    fs.readFile(path.join(__dirname, "sources", filename), (err, data) => {
        if (err) res.status(404).send("File not found");
        fs.rename(path.join(__dirname, "sources", filename), path.join(__dirname, "sources", newname), (err) => {
            if (err) res.status(500).send(err);
            res.send('File renamed!');
        });
    })
});

app.delete("/file/:filename", (req, res) => {
    var filename = path.join(__dirname, "sources", req.params.filename);
    fs.readFile(filename, (err, data) => {
        if (err) res.status(404).send("File not found");
        fs.unlink(filename, function (err) {
            if (err) throw err;
            res.json('File deleted!');
        });
    })
});


app.get("/list", (req, res) => {
    const dir = path.join(__dirname, "sources")
    fs.readdir(dir, (err, files) => {
        if (err) res.status(500).json(err);
        res.json(files);
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "list.html"));
});


var port = 3000;
app.listen(port, () => console.log("Running on port " + port));