const express = require('express')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const fs = require("fs")
const path = require("path")
const lib = require('./lib')
const users = require('./users')

const TARGET = "../libfprint"

const { VIDTYPE, DIRTYPE, vid_ext, encode, decode, dirtable} = require('./lib')

const port = 1337

const app = express()

app.use((req,res,next) => {
    console.log(req.originalUrl)
    next()
})

app.use(sessions({
    secret: `${Math.random()}`,
    saveUninitialized: true,
    resave: false
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static(__dirname))

app.use(cookieParser())

var session
var originalUrl

app.post('/user', (req, res) => {
    let user = users.getUser(req.body.username)
    if (user && (user.password == req.body.password)) {
            session = req.session
            session.userid = req.body.username
            console.log('/user', req.session)
            console.log('orgurl', originalUrl)
            res.redirect(originalUrl? originalUrl : '/')
    }else{
        res.send('Invalid username or password')
    }
})

app.use((req, res, next) => {
    session = req.session
    if (session.userid) {
        next()
    }else{
        if (req.originalUrl != '/') {
            originalUrl = req.originalUrl
            res.redirect('/')
        }else{
            res.sendFile('views/login.html', {root:__dirname})
        }
    }
})

app.get('/', (request, response) => {
    response.redirect(`/${DIRTYPE}/${encode(TARGET)}`);
});

app.get(`/${DIRTYPE}/:path`, (req, res) => {
    let decoded = decode(req.params.path)
    console.log(DIRTYPE, decoded)

    let sendme = dirtable(decoded)

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

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.redirect('/')
})

app.use((req,res,next) => {
    res.redirect('/')
})

app.listen(port, console.log(`App Listening to port ${port}`));