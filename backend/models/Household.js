const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Household name is required'],
        trim: true,
        maxlength: 100
    },
    roomCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 6
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Generate unique 6-character room code
householdSchema.statics.generateRoomCode = async function() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode;
    let exists = true;
    
    while (exists) {
        roomCode = '';
        for (let i = 0; i < 6; i++) {
            roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        exists = await this.findOne({ roomCode });
    }
    
    return roomCode;
};

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;