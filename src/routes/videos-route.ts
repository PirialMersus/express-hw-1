import { Request, Response, Router } from 'express';
import { db } from '../db/db';
import { HTTP_STATUSES } from '../shared/statuses';
import { ErrorType, Resolution, Resolutions, VideoDBType } from '../types';
import { log } from 'util';

export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response<any>) => {
  const videos = db.videos;

  res.send(videos).status(HTTP_STATUSES.OK_200);
});
videosRouter.get(
  '/:videoId',
  (req: Request<{ videoId: string }, {}, {}, {}>, res: Response) => {
    const id = req.params.videoId;

    const videos = db.videos;

    const foundVideo = videos.find(
      (video) => video.id.toString() === req.params.videoId,
    );
    if (foundVideo) {
      res.status(HTTP_STATUSES.OK_200).send(foundVideo);
      return;
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
videosRouter.post(
  '/',
  (
    req: Request<
      {},
      {},
      { title: string; author: string; availableResolutions: Resolutions },
      {}
    >,
    res: Response,
  ) => {
    let errors: ErrorType = {
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
        !Resolution[r] &&
          errors.errorsMessages.push({
            message: 'Invalid availableResolutions',
            field: 'availableResolutions',
          });
      });
    } else {
      availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
      return;
    }

    const createdAt = new Date();
    const publicationAT = new Date();
    publicationAT.setDate(createdAt.getDate() + 1);

    const newVideo: VideoDBType = {
      id: +new Date(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationAT.toISOString(),
      title,
      author,
      availableResolutions,
    };

    db.videos.push(newVideo);

    res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
  },
);

videosRouter.put(
  '/:videoId',
  (
    req: Request<
      { videoId: string },
      {},
      {
        title: string;
        author: string;
        availableResolutions: Resolutions;
        canBeDownloaded: boolean;
        minAgeRestriction: number;
        publicationDate: string;
        createdAt: string;
      },
      {}
    >,
    res: Response,
  ) => {
    let errors: ErrorType = {
      errorsMessages: [],
    };
    const id = +req.params.videoId;
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body ?? {};

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
    if (
      typeof canBeDownloaded !== 'undefined' &&
      typeof canBeDownloaded !== 'boolean'
    ) {
      errors.errorsMessages.push({
        message: 'Invalid canBeDownloaded',
        field: 'canBeDownloaded',
      });
    }

    if (
      !!minAgeRestriction &&
      (isNaN(+minAgeRestriction) ||
        minAgeRestriction < 1 ||
        minAgeRestriction > 18)
    ) {
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
      availableResolutions.map((r: keyof typeof Resolution) => {
        if (!Resolution[r]) {
          errors.errorsMessages.push({
            message: 'Invalid availableResolutions',
            field: 'availableResolutions',
          });
        }
      });
    }
    if (errors.errorsMessages.length) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
      return;
    }

    const foundVideo = db.videos.find((video) => video.id === id);
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
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  },
);

videosRouter.delete(
  '/:videoId',
  (req: Request<{ videoId: string }, {}, {}, {}>, res: Response) => {
    const videoId = +req.params.videoId;
    const videoIndex = db.videos.findIndex((video) => video.id === videoId);

    if (videoIndex !== -1) {
      db.videos.splice(videoIndex, 1); // Удаляем видео из базы данных
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  },
);
