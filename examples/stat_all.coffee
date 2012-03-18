fs = require 'fs'
Hash = require 'hashish'
Seq = require 'seq'

Seq()
    .seq(() ->
        fs.readdir(__dirname, @)
    )
    .flatten()
    .parEach((file) ->
        fs.stat(__dirname + '/' + file, @.into(file))
    )
    .seq(() ->
        sizes = Hash.map(@.vars, (s) -> s.size)
        console.dir sizes
    )
