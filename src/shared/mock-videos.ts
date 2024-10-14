import { Resolution, VideoDBType } from '../types';

export const testVideo: VideoDBType = {
  id: 12345,
  title: 'Super video 1',
  author: 'Gennadii',
  canBeDownloaded: false,
  minAgeRestriction: null,
  createdAt: '2023-07-17T15:50:40.497Z',
  publicationDate: '2023-11-22T12:23:08.880Z',
  availableResolutions: [Resolution.P144],
};

export const testVideo2: VideoDBType = {
  id: 12345,
  title: 'Super video 2',
  author: 'Julia',
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: '2023-07-17T15:50:40.497Z',
  publicationDate: '2023-07-17T15:50:40.497Z',
  availableResolutions: [Resolution.P360],
};
