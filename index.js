const express = require('express')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const fs = require("fs")
const path = require("path")
const lib = require('./lib')
const 

const { TARGET, VIDTYPE, DIRTYPE, vid_ext} = require('./lib')

const port = 80

const app = express()

app.use(sessions({
    secret: "thankyoutyler",
    saveUninitialized: true
}))

app.get('/', (request, response) => {
    response.redirect(`/${DIRTYPE}/${lib.encode(TARGET)}`);
});

app.get(`/${DIRTYPE}/:path`, (req, res) => {
    let decoded = lib.decode(req.params.path)
    console.log(DIRTYPE, decoded)

    res.send(lib.dirtable(decoded))
})

app.get("/v/:path", (req, res) => {
    res.sendFile(lib.decode(req.params.path))
})

app.get(`/${VIDTYPE}/:path`, (req, res) => {
    let p = lib.decode(req.params.path)
    let dir = path.dirname(p)
    let name = path.parse(p).name
    let ext = '.vtt'

    req.session

    let track = path.resolve(`${dir}/${name}${ext}`)

    console.log({track})

    res.send(
        lib.videoelement(req.params.path, encode(track)) +
        lib.dirtable(p)
    )
    //res.redirect(`/video2/${req.params.path}`)
})

app.get("/track/:path", (req, res) => {
    res.sendFile(lib.decode(req.params.path))
})  



app.listen(port, console.log(`App Listening to port ${port}`));