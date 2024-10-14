import {DBType} from '../src/db/db'
import {Resolution, VideoDBType} from "../src/types";

// готовые данные для переиспользования в тестах

export const video1: VideoDBType = {
  id: Date.now() + Math.random(),
  title: 't' + Date.now() + Math.random(),
  author: 'a' + Date.now() + Math.random(),
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: [Resolution.P240],
}

// ...

export const dataset1: DBType = {
  videos: [video1],
}

// ...
