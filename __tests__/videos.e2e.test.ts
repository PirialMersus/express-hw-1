import { req } from './test-helpers';
import { SETTINGS } from '../src/settings';
import { setDB } from '../src/db/db';
import { dataset1, video1 } from './datasets';
import { Resolution } from '../src/types';
import { HTTP_STATUSES } from '../src/shared/statuses';
import { testVideo } from '../src/shared/mock-videos';

describe(SETTINGS.PATH.CLEAR, () => {
  it('should clear all data', async () => {
    setDB(dataset1);

    const res = await req
      .delete(SETTINGS.PATH.CLEAR)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const videosRes = await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200);

    expect(videosRes.body.length).toBe(0);
  });

  it('should get not empty array', async () => {
    setDB(dataset1);

    const res = await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body[0]).toEqual(dataset1.videos[0]);
  });
});

describe(SETTINGS.PATH.VIDEOS, () => {
  beforeAll(async () => {
    setDB();
  });

  it('should get empty array', async () => {
    const res = await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.length).toBe(0);
  });

  it('should get not empty array', async () => {
    setDB(dataset1);

    const res = await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(dataset1.videos[0]);
  });
  it('should get correct video', async () => {
    setDB(dataset1);

    const res = await req
      .get(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual(dataset1.videos[0]);
    expect(res.body.id).toEqual(video1.id);
  });
  it("shouldn't get video with incorrect id", async () => {
    setDB(dataset1);

    await req
      .get(`${SETTINGS.PATH.VIDEOS}/11222333`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
  it(`shouldn't create video with incorrect data`, async () => {
    setDB();
    await req
      .post(SETTINGS.PATH.VIDEOS)
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await req.get('/videos').expect(HTTP_STATUSES.OK_200, []);
  });

  let createdVideo1: any = null;
  it('should create video with correct input data', async () => {
    setDB();
    const newVideo: any = {
      title: 't1',
      author: 'a1',
      availableResolutions: [Resolution.P720],
    };

    const response = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(newVideo) // отправка данных
      .expect(201);

    createdVideo1 = response.body;

    expect(createdVideo1.availableResolutions).toEqual(
      newVideo.availableResolutions,
    );
    expect(createdVideo1.title).toEqual(newVideo.title);
    expect(createdVideo1.author).toEqual(newVideo.author);

    await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200, [createdVideo1]);
  });

  let createdVideo2: any = null;
  it('should create one more video with correct data', async () => {
    const newVideo2: any = {
      title: 't2',
      author: 'a2',
      availableResolutions: [Resolution.P144],
    };
    const response = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(newVideo2)
      .expect(HTTP_STATUSES.CREATED_201);

    createdVideo2 = response.body;

    expect(newVideo2.availableResolutions).toEqual(
      createdVideo2.availableResolutions,
    );
    expect(newVideo2.title).toEqual(createdVideo2.title);
    expect(newVideo2.author).toEqual(createdVideo2.author);

    await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(HTTP_STATUSES.OK_200, [createdVideo1, createdVideo2]);
  });

  it("shouldn't update video with incorrect data", async () => {
    await req
      .put(`${SETTINGS.PATH.VIDEOS}/` + createdVideo1.id)
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await req
      .get(`${SETTINGS.PATH.VIDEOS}/` + createdVideo1.id)
      .expect(HTTP_STATUSES.OK_200, createdVideo1);
  });

  it("shouldn't update video which doesnt exists", async () => {
    await req
      .put(`${SETTINGS.PATH.VIDEOS}/` + 2)
      .send({
        title: 't1',
        author: 'a1',
        availableResolutions: [Resolution.P720],
      })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`should update video with correct data`, async () => {
    await req
      .put(`${SETTINGS.PATH.VIDEOS}/` + createdVideo1.id)
      .send(testVideo)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await req
      .get(`${SETTINGS.PATH.VIDEOS}/` + createdVideo1.id)
      .expect(HTTP_STATUSES.OK_200, {
        ...testVideo,
        id: createdVideo1.id,
        createdAt: createdVideo1.createdAt,
        publicationDate: testVideo.publicationDate,
      });
  });
  it(`should delete one video`, async () => {
    await req
      .delete(`${SETTINGS.PATH.VIDEOS}/${createdVideo1.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await req
      .get(`${SETTINGS.PATH.VIDEOS}/${createdVideo1.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`correct status if delete not existing video`, async () => {
    await req
      .delete(`${SETTINGS.PATH.VIDEOS}/-100`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
