const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    leaveType: {
        type: String,
        enum: ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'bereavement', 'other'],
        default: 'personal'
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function (value) {
                return value >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Start date cannot be in the past'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'End date must be after or equal to start date'
        }
    },
    totalDays: {
        type: Number,
        min: [0.5, 'Minimum leave is 0.5 days'],
        max: [30, 'Maximum leave cannot exceed 30 days']
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    adminComments: {
        type: String,
        trim: true,
        maxlength: [200, 'Comments cannot exceed 200 characters']
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedDate: {
        type: Date
    },
    attachments: [{
        filename: String,
        url: String
    }]
}, {
    collection: 'leaves',
    timestamps: true
});

// Pre-save hook to calculate totalDays
leaveSchema.pre('save', function () {
    if (this.isModified('startDate') || this.isModified('endDate')) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const timeDiff = end.getTime() - start.getTime();
        this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        if (this.totalDays <= 0) this.totalDays = 1;
    }
});

// Virtual for totalHours
leaveSchema.virtual('totalHours').get(function () {
    return this.totalDays * 8;
});

leaveSchema.set('toJSON', { virtuals: true });
leaveSchema.set('toObject', { virtuals: true });

leaveSchema.index({ user: 1, status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });
leaveSchema.index({ status: 1 });

// Check overlapping leaves
leaveSchema.statics.checkOverlap = async function (userId, startDate, endDate, excludeLeaveId = null) {
    const query = {
        user: userId,
        status: { $in: ['pending', 'approved'] },
        $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    };
    if (excludeLeaveId) query._id = { $ne: excludeLeaveId };
    const overlappingLeaves = await this.find(query);
    return overlappingLeaves.length > 0;
};

leaveSchema.methods.getStatusColor = function () {
    const colors = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        cancelled: 'secondary'
    };
    return colors[this.status] || 'secondary';
};

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
