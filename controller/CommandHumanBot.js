var google = require('google');
var bot = require('../utils/Born_Bot');
var config = require('../config');
var requestHttp = require('request-promise');
var xml2Json = require('xml2json');

// start command
bot.onText(/^\/start$/, function (msg) {
    bot.getMe()
        .then(function (data) {
            var MyBio = {
                id: data.id,
                first_name: data.first_name,
                username: data.username
            };

            bot.sendMessage(msg.chat.id, 'おかえりなさい, 私の名前わ ' + MyBio.first_name + " よるしく");
        })
        .catch(function (err) {
            console.log(err);
        });
});

// hello command
bot.onText(/^\/say_hello (.+)$/, function (msg, match) {
    var name = match[1];
    bot.sendMessage(msg.chat.id, 'Hello ' + name + '!').then(function () {
        // reply sent!
    });
});

// search command
bot.onText(/^\/search_g (.+)$/, function (msg, match) {
    google.resultsPerPage = 2;
    google.timeSpan = 'w';
    var nextCounter = 0;

    var keyword = match[1];

    google(keyword, function (err, res) {
        if (err) console.error(err);

        for (var i = 0; i < 2; ++i) {
            var link = res.links[i];
            bot.sendMessage(msg.chat.id, link.title + ' - ' + link.href + "\n" + link.description + "\n").then(function (err) {
                // reply sent!
                if (err.message) {
                    console.log("error : ", err.message);
                }
            });
        }

        if (nextCounter < 2) {
            nextCounter += 1;
            if (res.next) res.next()
        }

        bot.sendMessage(msg.chat.id, "I Found some result on Internet! Check it out!" + "\n");
    });
});

// ping as many as you want
bot.onText(/^\/ping \d{0,2}$/, function (msg, match) {
    var repeated = match.input.substr(6);
    for (var i = 0; i < repeated; ++i) {
        bot.sendMessage(msg.chat.id, '*PING!*', {parse_mode: 'Markdown'}).then(function () {
            //sent
        });
    }
});

// send sms to the other free 10/ days
bot.onText(/^\/sendsms[ ]0[1-9]\d{2,12}[#](.+)$/, function (msg, match) {
    // separate command, phone, message
    var mes = match[0].substr(match[0].indexOf(' ') + 1);
    var phoneNumber = mes.substr(0, mes.indexOf('#'));
    var message = mes.substr(mes.indexOf('#') + 1);

    var urlBuilder = "https://reguler.zenziva.net/apps/smsapi.php?userkey=" + config.userkey_zenzivia +
        "&passkey=" + config.passkey_zenzivia + "&nohp=" + phoneNumber + "&pesan=" + message;
    console.log(urlBuilder);
    var reqOpt = {
        uri: urlBuilder,
        json: true
    };

    requestHttp(reqOpt)
        .then(function (response) {
            var to = convertXMLtoJSON(response).to[0];
            var status = convertXMLtoJSON(response).text[0];
            bot.sendMessage(msg.chat.id, status + " sent to " + to).then(function () {
            });
        })
        .catch(function (err) {
            bot.sendMessage(msg.chat.id, "Failed send sms with error : ", err.message).then(function () {
            });
        });
});

// kick people command
bot.onText(/^$/, function (msg, match) {

});

// show all availiable command
bot.onText(/^\/showcommand$/, function (msg, match) {
    var message = "";

    message += "Availiable command : \n \n";
    message += "/start is for introduce the bot \n";
    message += "/say_hello (string) say hello to the other \n";
    message += "/search_g (string) search something on google \n";
    message += "/ping (number [2]) send PING message on group \n";
    message += "/sendsms (number[12]) (string) send sms for free 10/day supported by zenzivia";

    bot.sendMessage(msg.chat.id, message).then(function () {});
});

function convertXMLtoJSON(response) {
    var options = {
        object: true,
        reversible: false,
        coerce: false,
        sanitize: true,
        trim: true,
        arrayNotation: true
    };

    var result = xml2Json.toJson(response, options);

    return result.response[0].message[0];
}

module.exports = bot;
