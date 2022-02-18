const fs = require('fs')
const yml = require('yaml')

var userdata = {}

function load() {
    userdata = yml.parse(fs.readFileSync('./users.yml', 'utf8'))
}

function save() {
    fs.writeFile('./users.yml')
}