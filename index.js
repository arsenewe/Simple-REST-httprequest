// API Dependencies
const http = require('http');
const url = require('url');
const String = require('string_decoder').StringDecoder;

// import handler


// buat http server
const httpServer = http.createServer(function (req,res) {
    server(req,res);
});

// start http server
httpServer.listen(8080, function () {
    console.log('Port aktif: 8080')
});

// properti server
const server = function (req,res) {
    // alamat url
    let parsedUrl = url.parse(req.url, true);

    // ambil path dari url
    let path = parsedUrl.pathname;
    let singkatPath = path.replace(/^\/+|\/+$/g, '');

    // ambil stringnya query sebagai objek
    let queryStringObject = parsedUrl.query;

    // http method
    let method = req.method.toLowerCase();

    // header menjadi objek
    let headers = req.headers;
    console.log("log: header", headers);

    // buffer
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // pilih handler untuk request yang dituju
        let pilihHandler = typeof (router[singkatPath]) !== 'undefined' ? router[singkatPath]: handlers.notFound();

        // buat data object yang bakal dikirim ke handler
        let data = {
            'singkatPath' : singkatPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer

        };

        // jalur request ke handler tertentu
        pilihHandler(data, function (statusCode, payload) {
            // pakai status code atau pake 200
            statusCode = typeof (statusCode) == 'number' ? statusCode: 200;

            payload = typeof (payload) == 'object' ? payload: {};

            // konversi payload ke string
            let payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString);

            // log path
            console.log(`Return respon: ${statusCode} ${buffer}`);
        });
    });
};

// request
let router = {
    'hello' : handlers.hello(),
}

