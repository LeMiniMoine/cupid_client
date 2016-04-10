/**
 * Created by mdauphinais on 10.04.16.
 */


var ngrok = require('ngrok');

var roomId = 'Y2lzY29zcGFyazovL3VzL1JPT00vMDA2ZTdiMjAtZmQxMS0xMWU1LTg2NDUtOWZjNGE1MmNmMGQ5';
var client = new Client();
var user = 'mdauph1@gmail.com';
var auth = 'Bearer N2I5YzMxMDMtMTQ5NS00N2MwLThkYzItZjU4OWQ3YmFhZjMwNzVmNDljMzYtYzc3';

var args = {
    headers: {
        'Content-type': 'application/json; charset=utf-8',
        'Authorization': auth
    }
};

ngrok.connect(
    {
        proto: 'http',
        addr: 3033
    },
    function (err, url) {
        args.data = {
            name: 'mikeWebHook',
            targetUrl: url,
            resource: 'messages',
            event: 'created',
            filter: 'roomId='.concat(roomId)
        };

        console.log('creating webhook..');
        client.post('https://api.ciscospark.com/v1/webhooks', args, function (data, response) {
            console.log('Webhook created: ', response.statusCode);

            restApp.use(bodyParser.json());
            restApp.post('/', function (req, res) {
                getMessageFromCisco(req.body.data.id);
            });
            restApp.get('/merge', function (req, res) {
                res.send(mergeConflicts);
            });
            restApp.listen(3033);
            console.log('Listening on port 3033...');
        });
    });