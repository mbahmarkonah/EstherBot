'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');
const unknownRules = require('./unknown.json')

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        prompt: (bot) => bot.say('Halo saya DoBot \u{1F916}\n Siapakah nama kamu?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(`OK, DoBot akan panggil kamu ${name}`))
                .then(() => 'speak');
        }
    },
    
    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }
                
                if (!_.has(scriptRules, upperText)) {
                    
                    if (upperText == String('/START')){
                    return bot.say('Start Dobot \u{1F916}').then(() => 'start');
                    }
                    
                    return bot.say('Pusing Dobot \u{1F916}').then(() => 'speak');
                }
                
                var response = scriptRules[0];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
