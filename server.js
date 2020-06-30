const http = require('http'),
url = require('url');

http.createServe((request, reponse) => {
    let adrr = request.url,
    q =  url.parse(adrr, true),
    filePath = '';

    if (q.pathname.includes('documentation')) {
        filePath = (_dirname + '/documentation.html');
    } else {
        filPath = 'index.html';
    }

 fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Added to log.');
    }

});
    

}).listen(8080)