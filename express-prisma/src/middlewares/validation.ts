import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
};

export const validate = (validations: ValidationChain[]) => {
  return [...validations, validateRequest];
};

export const validateRegister = validate([
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("min length 6"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirPassword is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password is not match");
      }
      return true;
    }),

]);
