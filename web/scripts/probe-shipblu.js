const https = require('https');

const endpoints = [
    'api.shipblu.com',
    'api.shipblu.com/v1',
    'app.shipblu.com/api',
];

endpoints.forEach(hostPath => {
    const [host, ...pathParts] = hostPath.split('/');
    const path = '/' + pathParts.join('/');

    const options = {
        hostname: host,
        path: path,
        method: 'GET',
        timeout: 5000
    };

    const req = https.request(options, res => {
        console.log(`${hostPath}: ${res.statusCode}`);
    });

    req.on('error', error => {
        console.log(`${hostPath}: Failed - ${error.message}`);
    });

    req.end();
});
