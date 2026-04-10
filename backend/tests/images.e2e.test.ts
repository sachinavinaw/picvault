import request from 'supertest';
import app from '../src/app';

describe('Images API', () => {
  it('returns 400 when no files are provided', async () => {
    const res = await request(app).post('/api/images');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when content type is not multipart/form-data', async () => {
    const res = await request(app).post('/api/images').set('Content-Type', 'application/json').send({ test: 'data' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid content type/i);
  });

  it('returns 200 and an array when listing images', async () => {
    const res = await request(app).get('/api/images');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('images');
    expect(Array.isArray(res.body.images)).toBe(true);
  });

  it('returns an error status for non-existent image files', async () => {
    const res = await request(app).get('/api/images/file/non-existent-key');
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
