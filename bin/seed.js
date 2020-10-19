var db = require('../utils/db');

let Skill = require('../models/skill');


let basicCharacteristics = ['able', 'accepting', 'adaptable', 'bold', 'brave', 'calm', 'caring', 'cheerful', 'clever', 'complex', 'bad', 'confident', 'dependable', 'dignified', 'energetic', 'extroverted', 'friendly', 'giving', 'happy', 'helpful', 'idealistic', 'independent', 'ingenious', 'intelligent', 'introverted', 'kind', 'knowledgeable', 'logical', 'loving', 'mature', 'modest', 'nervous', 'observant', 'organised', 'patient', 'powerful', 'proud', 'quiet', 'reflective', 'relaxed', 'religious', 'responsive', 'searching', 'self-assertive', 'self-conscious', 'sensible', 'sentimental', 'shy', 'silly', 'spontaneous', 'sympathetic', 'tense', 'trustworthy', 'warm', 'wise', 'witt'];
Skill.remove({})
    .then(() => {
        let characteristic = [];
        for (let i = 0; i < basicCharacteristics.length; i++) {
            characteristic.push({
                skillTitle: basicCharacteristics[i]
            });
        }
        return Skill.create(characteristic);
    })
    .then((skillsAdded) => {
        console.log("Skills added: "+ skillsAdded.length);
        process.exit(1);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });


