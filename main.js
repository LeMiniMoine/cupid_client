

var ngrok = require('ngrok');
var chokidar = require('chokidar');
var simpleGit = require('simple-git')();
var Client = require('node-rest-client').Client;
var express = require('express');
var restApp = express();
var bodyParser = require('body-parser');

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

chokidar.watch('.', {ignored: /^\.idea|^\.git/gm}).on('change', function (path, event) {
    simpleGit.diffSummary(function (error, response) {
        var files = response.files.map(function (file) {
            return file.file
        });


        var changes = {
            user: user,
            files: files
        };

        console.log('Sending new changes...');
        args.data = {
            'roomId': roomId,
            'text': JSON.stringify(changes)
        };

        client.post('https://api.ciscospark.com/v1/messages', args, function (data, response) {
            console.log('Message sent: ', response.statusCode);
        });
    });
});

ngrok.connect(
    {
        proto: 'http',
        addr: 7077
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
            restApp.listen(7077);
            console.log('Listening on port 7077...');
        });
    });

var getMessageFromCisco = function (messageId) {
    client.get('https://api.ciscospark.com/v1/messages/'.concat(messageId), args, function (data, response) {
        var receivedChanges = JSON.parse(data.text);
        //console.log(receivedChanges);
        if(data.personEmail == 'taffsmania@hotmail.com') {
            console.log(data.text);
        }
    })
};


