const fs = require('fs')
const yml = require('yaml')

var userdata

function load() {
    userdata = yml.parse(fs.readFileSync('./users.yml', 'utf8'))
}

function getUser(user) {
    if (!userdata) {
        load()
    }

    for (let i = 0; i < userdata.users.length; i += 1) {
        if (userdata.users[i].uid == user) {
            return userdata.users[i]
        }
    }
}

module.exports = {getUser}