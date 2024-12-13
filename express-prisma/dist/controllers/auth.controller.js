"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const user_service_1 = require("../services/user.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../services/mailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword } = req.body;
                if (password != confirmPassword)
                    throw { message: "Password not match!" };
                const user = yield (0, user_service_1.findUser)(req.body.username, req.body.email);
                if (user)
                    throw { message: "username or email has been used" };
                delete req.body.confirmPassword;
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                req.body.password = hashPassword;
                const newUser = yield prisma_1.default.user.create({ data: req.body });
                const payload = { id: newUser.id, role: newUser.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "10m" });
                const link = `${process.env.BASE_URL_FE}/verify/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "verify.html");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compailedTemplate = handlebars_1.default.compile(templateSource);
                const html = compailedTemplate({ username: req.body.username, link });
                yield mailer_1.transporter.sendMail({
                    from: "Blogger Admin",
                    to: req.body.email,
                    subject: "Welcome to Blogger 🙌",
                    html,
                });
                res.status(200).send({ message: "Register Success✅, Check your email to verify" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const user = yield (0, user_service_1.findUser)(data, data);
                if (!user)
                    throw { message: "Account not found" };
                if (user.isSuspend)
                    throw { message: "Account is suspended" };
                if (!user.isVerify)
                    throw { message: "Account is not verified" };
                const isValidPassword = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPassword)
                    throw { message: "Incorrect Password" };
                const payload = { id: user.id, role: user.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "10m" });
                res
                    .status(200)
                    .cookie("token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 10,
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                })
                    .send({
                    message: "Login Successfully ✅",
                    user,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const verifiedUser = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
                yield prisma_1.default.user.update({
                    data: { isVerify: true },
                    where: { id: verifiedUser.id },
                });
                res.status(200).send({ message: "Account has been verified" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.AuthController = AuthController;
