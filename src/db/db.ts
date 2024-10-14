import { VideoDBType } from '../types';

export type DBType = {
  videos: VideoDBType[];
};

export const db: DBType = {
  videos: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    return;
  }

  db.videos = dataset.videos || db.videos;
};
