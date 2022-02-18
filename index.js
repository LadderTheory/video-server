const express = require('express')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const fs = require("fs")
const path = require("path")
const lib = require('./lib')

const { TARGET, VIDTYPE, DIRTYPE, vid_ext, encode, decode, dirtable} = require('./lib')

const port = 80

const app = express()

app.use(sessions({
    secret: "thankyoutyler",
    saveUninitialized: true
}))

app.get('/', (request, response) => {
    response.redirect(`/${DIRTYPE}/${encode(TARGET)}`);
});

app.get(`/${DIRTYPE}/:path`, (req, res) => {
    let decoded = decode(req.params.path)
    console.log(DIRTYPE, decoded)

    let sendme = dirtable(decoded)

    console.log("get", sendme)

    res.send(sendme)
})

app.get(`/v/:path`, (req, res) => {
    res.sendFile(decode(req.params.path))
})

app.get(`/${VIDTYPE}/:path`, (req, res) => {
    let p = decode(req.params.path)
    let dir = path.dirname(p)
    let name = path.parse(p).name
    let ext = '.vtt'

    req.session

    let track = path.resolve(`${dir}/${name}${ext}`)

    console.log({track})

    res.send(
        lib.videoelement(req.params.path, encode(track)) +
        lib.dirtable(dir)
    )
    //res.redirect(`/video2/${req.params.path}`)
})

app.get("/track/:path", (req, res) => {
    res.sendFile(decode(req.params.path))
})  



app.listen(port, console.log(`App Listening to port ${port}`));