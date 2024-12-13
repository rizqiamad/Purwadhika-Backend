"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    next();
};
const validate = (validations) => {
    return [...validations, validateRequest];
};
exports.validate = validate;
exports.validateRegister = (0, exports.validate)([
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is not valid"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("min length 6"),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("confirPassword is required")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password is not match");
        }
        return true;
    }),
]);
