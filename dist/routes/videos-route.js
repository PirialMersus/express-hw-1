"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const statuses_1 = require("../shared/statuses");
const types_1 = require("../types");
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter.get('/', (req, res) => {
    const videos = db_1.db.videos;
    res.send(videos).status(statuses_1.HTTP_STATUSES.OK_200);
});
exports.videosRouter.get('/:videoId', (req, res) => {
    const id = req.params.videoId;
    // console.log('id id', id);
    const videos = db_1.db.videos;
    const foundVideo = videos.find((video) => video.id.toString() === req.params.videoId);
    // console.log('foundVideo foundVideo', foundVideo);
    if (foundVideo) {
        res.status(statuses_1.HTTP_STATUSES.OK_200).send(foundVideo);
        // console.log(' if if');
        return;
    }
    res.sendStatus(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
});
exports.videosRouter.post('/', (req, res) => {
    let errors = {
        errorsMessages: [],
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({
            message: 'Invalid author',
            field: 'author',
        });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !types_1.Resolution[r] &&
                errors.errorsMessages.push({
                    message: 'Invalid availableResolutions',
                    field: 'availableResolutions',
                });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(statuses_1.HTTP_STATUSES.BAD_REQUEST_400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationAT = new Date();
    publicationAT.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationAT.toISOString(),
        title,
        author,
        availableResolutions,
    };
    db_1.db.videos.push(newVideo);
    res.status(statuses_1.HTTP_STATUSES.CREATED_201).send(newVideo);
});
exports.videosRouter.put('/:videoId', (req, res) => {
    var _a;
    let errors = {
        errorsMessages: [],
    };
    const id = +req.params.videoId;
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate,
    // createdAt,
     } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    const availableResolutionsExists = Array.isArray(availableResolutions);
    const date = publicationDate
        ? new Date(publicationDate).toISOString()
        : undefined;
    if (publicationDate !== 'undefined' && date !== publicationDate) {
        errors.errorsMessages.push({
            message: 'Invalid publicationDate',
            field: 'publicationDate',
        });
    }
    if (typeof canBeDownloaded !== 'undefined' &&
        typeof canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'Invalid canBeDownloaded',
            field: 'canBeDownloaded',
        });
    }
    if (!!minAgeRestriction &&
        (isNaN(+minAgeRestriction) ||
            minAgeRestriction < 1 ||
            minAgeRestriction > 18)) {
        errors.errorsMessages.push({
            message: 'Invalid minAgeRestriction',
            field: 'minAgeRestriction',
        });
    }
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({
            message: 'Invalid author',
            field: 'author',
        });
    }
    if (availableResolutionsExists && availableResolutions) {
        availableResolutions.map((r) => {
            if (!types_1.Resolution[r]) {
                errors.errorsMessages.push({
                    message: 'Invalid availableResolutions',
                    field: 'availableResolutions',
                });
            }
        });
    }
    if (errors.errorsMessages.length) {
        res.status(statuses_1.HTTP_STATUSES.BAD_REQUEST_400).send(errors);
        return;
    }
    const foundVideo = db_1.db.videos.find((video) => video.id === id);
    if (foundVideo) {
        if (canBeDownloaded) {
            foundVideo.canBeDownloaded = canBeDownloaded
                ? Boolean(canBeDownloaded)
                : false;
        }
        if (minAgeRestriction) {
            foundVideo.minAgeRestriction = +minAgeRestriction || null;
        }
        if (availableResolutionsExists) {
            foundVideo.availableResolutions = availableResolutions || null;
        }
        foundVideo.title = title;
        foundVideo.author = author;
        foundVideo.publicationDate = publicationDate;
        res.sendStatus(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }
    else {
        res.sendStatus(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
});
exports.videosRouter.delete('/:videoId', (req, res) => {
    const videoId = +req.params.videoId;
    const videoIndex = db_1.db.videos.findIndex((video) => video.id === videoId);
    if (videoIndex !== -1) {
        db_1.db.videos.splice(videoIndex, 1); // Удаляем видео из базы данных
        res.sendStatus(statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }
    else {
        res.sendStatus(statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
});
