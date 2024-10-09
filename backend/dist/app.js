"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./mongodb/config"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const port = 3001;
const app = (0, express_1.default)();
const currentWorkingDir = path_1.default.resolve();
const parentDir = path_1.default.dirname(currentWorkingDir);
dotenv_1.default.config();
(0, config_1.default)();
app.use((0, express_session_1.default)({
    secret: 'dfsd$54dwSeeers',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)('your_secret_key_here'));
const corsOptions = {
    origin: [process.env.FrontEndUrl, 'http://localhost:3001'],
    credentials: true,
    crossOriginOpenerPolicy: 'same-origin',
};
app.use((0, cors_1.default)(corsOptions));
app.use('/user', userRouter_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => res.sendFile(path_1.default.resolve(__dirname, "../frontend/dist", "index.html")));
app.listen(port, () => {
    console.log(`connected to http://localhost:${port}/`);
});
