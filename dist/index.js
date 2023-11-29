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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const promises_1 = __importDefault(require("fs/promises"));
dotenv_1.default.config();
let links;
const app = (0, express_1.default)();
const port = process.env.PORT;
const host = process.env.HOST;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const writeToUrlData = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile("./data/url-data.json", JSON.stringify(payload));
});
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const urlData = yield promises_1.default.readFile("./data/url-data.json", "utf8");
    links = JSON.parse(urlData);
    next();
}));
app.get("/:shrinked", (req, res, next) => {
    const chosen = links.filter(item => item.shrinked === req.params.shrinked);
    chosen.length ?
        res.redirect(chosen[0].target) :
        res.status(404).send("Not Found");
});
app.post("/:target", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let hash = (Math.random() + 1).toString(36).substring(7);
    links.push({
        target: `https://${req.params.target}`,
        shrinked: hash
    });
    yield writeToUrlData(links);
    res.status(200).send(`http://${host}:${port}/${hash}`);
}));
app.listen({ port, host }, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
