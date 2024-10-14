"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testVideo2 = exports.testVideo = void 0;
const types_1 = require("../types");
exports.testVideo = {
    id: 12345,
    title: 'Super video 1',
    author: 'Gennadii',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: '2023-07-17T15:50:40.497Z',
    publicationDate: '2023-11-22T12:23:08.880Z',
    availableResolutions: [types_1.Resolution.P144],
};
exports.testVideo2 = {
    id: 12345,
    title: 'Super video 2',
    author: 'Julia',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: '2023-07-17T15:50:40.497Z',
    publicationDate: '2023-07-17T15:50:40.497Z',
    availableResolutions: [types_1.Resolution.P360],
};
