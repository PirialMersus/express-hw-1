"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = void 0;
const db_1 = require("../db/db");
const deleteVideoController = (req, res) => {
    const videos = db_1.db.videos; // получаем видео из базы данных
    res
        .status(200)
        .json(videos); // отдаём видео в качестве ответа
};
exports.deleteVideoController = deleteVideoController;
// не забудьте добавить эндпоинт в апп
