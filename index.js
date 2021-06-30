const { json } = require('body-parser')
const express = require('express')
const fs = require("fs")
const path = require("path")

const app = express()

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        let p = path.join(__dirname, dirPath, "/", file)
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            //arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            arrayOfFiles.push({ 
                path: p,
                type: "dir"
            })
        } else {
            if (p.toString().substr(-4) === ".mp4") {
                arrayOfFiles.push({
                    path: p,
                    type: "mp4"
                })
            }
        }
    })

    return arrayOfFiles
}

app.get('/', (request, response) => {
    let files = getAllFiles("../stuff")

    response.send(
        "<table><tbody>" + 
        files.map(x => `<td>${x.path}</td><td>${x.type}</td>`).reduce((acc, x) => acc + `<tr>${x}</tr>`) +
        "</tbody></table>"
    );
});

app.get("/dir", (req, res) => {
    res.send("dir!")
})

function linkfrom(a) {
    return `<a href=""`
}

app.listen(3000, console.log('App Listening to port 3000'));