import request from "supertest";
import app from "../src/app";

jest.mock("../src/models/image.model", () => ({
  ImageModel: {
    findAll: jest.fn().mockResolvedValue([
      {
        id: "123",
        url: "/api/images/file/123",
        original_filename: "test.jpg",
      },
    ]),
  },
}));

describe("List Images API", () => {
  test("returns list of images", async () => {
    const res = await request(app).get("/api/images");

    expect(res.status).toBe(200);
    expect(res.body.images.length).toBe(1);
    expect(res.body.images[0].id).toBe("123");
  });
});
