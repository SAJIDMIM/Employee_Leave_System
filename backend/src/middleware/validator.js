const { body, validationResult } = require('express-validator');

// Login validation
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

// Leave request validation
const validateLeaveRequest = [
    body('startDate')
        .isISO8601()
        .withMessage('Please provide a valid start date')
        .custom((value, { req }) => {
            if (new Date(value) < new Date()) {
                throw new Error('Start date cannot be in the past');
            }
            return true;
        }),
    body('endDate')
        .isISO8601()
        .withMessage('Please provide a valid end date')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        }),
    body('reason')
        .notEmpty()
        .withMessage('Reason is required')
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateLogin, validateLeaveRequest };