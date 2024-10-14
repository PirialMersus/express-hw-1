import cors from 'cors';
import express from 'express';

import { setDB } from './db/db';
import { videosRouter } from './routes/videos-route';
import { SETTINGS } from './settings';
import { HTTP_STATUSES } from './shared/statuses';

export const app = express(); // создать приложение
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.0' });
});
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.VIDEOS, videosRouter);

app.delete(SETTINGS.PATH.CLEAR, (req, res) => {
  setDB();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
