"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const videos_route_1 = require("./routes/videos-route");
const settings_1 = require("./settings");
const statuses_1 = require("./shared/statuses");
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
exports.app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.0' });
});
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
exports.app.use(settings_1.SETTINGS.PATH.VIDEOS, videos_route_1.videosRouter);
exports.app.delete(settings_1.SETTINGS.PATH.CLEAR, (req, res) => {
    (0, db_1.setDB)();
    res.sendStatus(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
});
