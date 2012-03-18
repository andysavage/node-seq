fs = require 'fs'
exec = require('child_process').exec
Seq = require 'seq'

Seq()
    .seq(() -> exec 'whoami', @)
    .par((who) -> exec('groups ' + who, @))
    .par((who) -> fs.readFile(__filename, 'utf8', @))
    .seq((groups, src) ->
        console.log('Groups: ' + groups.trim())
        console.log('This file has ' + src.length + ' bytes')
    )
