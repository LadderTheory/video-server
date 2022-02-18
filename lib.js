const fs = require('fs')

const TARGET = "./target"

const vid_ext = [
    '.mp4',
    '.m4v',
]

const VIDTYPE = "v"
const DIRTYPE = "d"

function getAllFiles(dirPath) {
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

function dirtable(a) {
    let files = getAllFiles(a)

    return (
        "<table><tbody>" + 
        files.map(x => `<td>${linkfrom(x)}</td><td>${x.type}</td>`).reduce((acc, x) => acc + `<tr>${x}</tr>`) +
        "</tbody></table>"
    )
}

function videoelement(v,t) {
    return (
        `<video id="videoplayer" controls width="90%">` +
        `<source src="/v/${v}" type="video/mp4"/>` +
        `<track default kind="subtitles" label="en" src="/track/${t}"/>` +
        `</video>`
    )
}

function linkfrom(a) {
    return 
        `<a href="/${a.type}/${encode(a.path)}">${a.title}</a>`
}

function encode(h) {
    return Buffer.from(h).toString('base64')
}

function decode(h) {
    return Buffer.from(h, "base64").toString()
}

module.exports = { TARGET, DIRTYPE, VIDTYPE, vid_ext, dirtable, videoelement, encode, decode }