const { json } = require('body-parser')
const { dir } = require('console')
const { response } = require('express')
const express = require('express')
const fs = require("fs")
const path = require("path")

const port = 80

const app = express()

const TARGET = "./target"

const vid_ext = [
    '.mp4',
    '.m4v',
]

const VIDTYPE = "v"
const DIRTYPE = "d"

const getAllFiles = function(dirPath) {
    console.log({dirPath});
    files = fs.readdirSync(dirPath)

    arrayOfFiles = [{
        path: path.join(dirPath + "/.."),
        title: "go back (thank you tyler)",
        type: DIRTYPE
    }]

    files.forEach(function(file) {
        let p = path.resolve(path.join(dirPath, "/", file))
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles.push({ 
                path: p,
                title: file,
                type: DIRTYPE
            })
        } else {
            if (vid_ext.includes(path.extname(p))) {
                arrayOfFiles.push({
                    path: p,
                    title: file,
                    type: VIDTYPE
                })
            }
        }
    })

    return arrayOfFiles
}

app.get('/', (request, response) => {
    response.redirect(`/${DIRTYPE}/${encode(TARGET)}`);
});

app.get('/pass/:pwd', (req,res) => {
    let pwd = decode(req.params.pwd)
    if (pwd === 'h') {
        res.redirect(`/${DIRTYPE}/${encode(TARGET)}`)
    }
})

app.get(`/${DIRTYPE}/:path`, (req, res) => {
    let decoded = decode(req.params.path)
    console.log(DIRTYPE, decoded)

    res.send(dirtable(decoded))
})

app.get("/video/:path", (req, res) => {
    let decoded = decode(req.params.path)
    console.log("video", {decoded})
    let stat = fs.statSync(decoded)
    let fileSize = stat.size
    let range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(decoded, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})

app.get("/video2/:path", (req, res) => {
    res.sendFile(decode(req.params.path))
})

app.get(`/${VIDTYPE}/:path`, (req, res) => {
    let p = decode(req.params.path)
    let dir = path.dirname(p)
    let name = path.parse(p).name
    let ext = '.vtt'

    let track = path.resolve(`${dir}/${name}${ext}`)

    console.log({track})

    res.send(
        `<video id="videoplayer" controls width="90%">` +
        `<source src="/video/${req.params.path}" type="video/mp4"/>` +
        `<track default kind="subtitles" label="en" src="/track/${encode(track)}"/>` +
        `</video>`
    )
    //res.redirect(`/video2/${req.params.path}`)
})

app.get("/track/:path", (req, res) => {
    res.sendFile(decode(req.params.path))
})

function dirtable(a) {
    let files = getAllFiles(a)

    return (
        "<table><tbody>" + 
        files.map(x => `<td>${linkfrom(x)}</td><td>${x.type}</td>`).reduce((acc, x) => acc + `<tr>${x}</tr>`) +
        "</tbody></table>"
    )
}

function linkfrom(a) {
    return `<a href="/${a.type}/${encode(a.path)}">${a.title}</a>`
}

function encode(h) {
    return Buffer.from(h).toString('base64')
}

function decode(h) {
    return Buffer.from(h, "base64").toString()
}

app.listen(port, console.log(`App Listening to port ${port}`));