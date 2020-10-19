const mongoose = require('mongoose');
// TODO personalCharacteristic
const SkillSchema = new mongoose.Schema({
    skillTitle: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;

