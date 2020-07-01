const http = require('http'),
url = require('url'),
fs = require ('fs)')

http.createServer((request, reponse) => {
    let adrr = request.url,
    q =  url.parse(adrr, true),
    filePath = '';

    if (q.pathname.includes('documentation')) {
        filePath = (_dirname + '/documentation.html');
    } else {
        filPath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
        throw err;
        }

 fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Added to log.');
    }

});

reponse.writeHead(200,{'Contnet-Type':'text.html'});
reponse.write(datat);
reponse.end();
    });


}).listen(8080)