import request from "supertest";
import app from "../src/app";

// Mock MinIO so tests don't depend on external service
jest.mock("../src/config/minio", () => ({
  minioClient: {
    putObject: jest.fn().mockResolvedValue({}),
    statObject: jest.fn().mockResolvedValue({
      metaData: { "content-type": "image/jpeg" },
    }),
    getObject: jest.fn().mockResolvedValue({
      on: jest.fn(),
      pipe: jest.fn(),
    }),
  },
  BUCKET_NAME: "picvault",
}));

describe("Image Upload Validation", () => {
  const endpoint = "/api/images";

  // Utility: create a fake file buffer
  const fakeImage = Buffer.from([0xff, 0xd8, 0xff]); // minimal JPEG header

  test("should reject non-multipart requests", async () => {
    const res = await request(app).post(endpoint).send({ foo: "bar" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/multipart\/form-data/i);
  });

  test("should reject when no files are provided", async () => {
    const res = await request(app).post(endpoint).field("dummy", "value");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no files provided/i);
  });

  test("should reject non-image file types", async () => {
    const res = await request(app)
      .post(endpoint)
      .attach("files", Buffer.from("not an image"), {
        filename: "test.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only image files/i);
  });

  test("should reject files larger than 50MB", async () => {
    const bigBuffer = Buffer.alloc(51 * 1024 * 1024); // 51MB

    const res = await request(app).post(endpoint).attach("files", bigBuffer, {
      filename: "big.jpg",
      contentType: "image/jpeg",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/max size is 50mb/i);
  }, 10000);

  test("should reject more than 20 files", async () => {
    const req = request(app).post(endpoint);

    for (let i = 0; i < 21; i++) {
      req.attach("files", fakeImage, {
        filename: `img${i}.jpg`,
        contentType: "image/jpeg",
      });
    }

    const res = await req;

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/maximum of 20 images/i);
  });

  test("✅ accepts valid image upload", async () => {
    const res = await request(app).post(endpoint).attach("files", fakeImage, {
      filename: "valid.jpg",
      contentType: "image/jpeg",
    });

    expect(res.status).toBe(201);
    expect(res.body.images).toBeDefined();
    expect(res.body.images.length).toBe(1);
    expect(res.body.images[0].url).toMatch(/\/api\/images\/file\//);
  });
});
