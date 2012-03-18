fs = require 'fs'
Hash = require 'hashish'
Seq = require 'seq'

lib = (args, cb) ->
  error = null

  if args == undefined
    error = new Error('args is neccesary')

  cb(error, args)

result = null
Seq()
    .seq(() ->
      lib('Hello', @)
    )
    .seq((args) ->
      result = args
      lib(undefined, @)
    )
    .catch((error) ->
      console.log(result)
      console.error(error)
    )
    .seq((args) ->
      throw new Error('This must passed')
    )
