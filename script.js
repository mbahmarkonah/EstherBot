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
        receive: (bot) => {
            return bot.say('Halo saya DoBot \u{1F916} \n--------------------- \nDobot adalah personal assistant yang siap sedia membantu mengenai informasi GT Troubleshooting Blok 1&2 serta membantu konversi air intake filter. \n \nKetik HELP atau TOLONG untuk informasi lebih lanjut')
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
                    
                    if (upperText == String('KONVERSI')){
                        return bot.say('Silahkan masukkan data DP dalam mm').then(() => 'konversi');
                    }
                    
                    if (upperText == (String('HELP') || String('TOLONG'))){
                        return bot.say('Silahkan masukkan data DP dalam mm').then(() => 'konversi');
                    }
                    
                    if (upperText == (String('START') || String('/START'))){
                        return bot.say('Start ulang DoBot.\nKetik 'OK' \u{1F44C}.').then(() => 'start');
                    }
                    
                    var unknown = new String(Math.floor((Math.random() * 9) +1));
                    var unknownx = unknownRules[unknown]; 
                    return bot.say('\u{1F635} '+ unknownx).then(() => 'speak');
                }
                
                var response = scriptRules[upperText];
                var lines = response.split('\nl');

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
    },
    konversi: {
        receive: (bot, message) => {
            var konversi = message.text;
            konversi = konversi * 0.0393701;
            konversi = konversi.toFixed(1);
            return bot.say('DP adalah ' + konversi + ' inch')
            .then(() => 'speak');
        }
    }

});
