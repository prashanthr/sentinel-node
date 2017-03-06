import express from 'express'
import http from 'http'
import compression from 'compression'
import bodyParser from 'body-parser'
import pmxlib from 'pmx'
import _debug from 'debug'
var debug = _debug('server')

var pmx = pmxlib.init({
  http: true, // HTTP routes logging (default: true)
  ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors: true, // Exceptions loggin (default: true)
  custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network: true, // Network monitoring at the application level
  ports: true  // Shows which ports your app is listening on (default: false)
})

var app = express()
app.use(compression())
app.use(bodyParser.json({limit: '0.5mb'}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(pmx.expressErrorHandler())

var probe = pmx.probe()

var histogram = probe.histogram({
  name: 'latency',
  measurement: 'mean'
})

var latency = 0

setInterval(() => {
  latency = Math.round(Math.random() * 100)
  histogram.update(latency)
}, 100)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(7777, function () {
  console.log('Example app listening on port 3000!')
})

