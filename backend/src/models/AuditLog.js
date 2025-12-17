const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leave: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave'
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);