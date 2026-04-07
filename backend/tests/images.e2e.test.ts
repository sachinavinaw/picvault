import request from "supertest";
import app from "../src/app";

describe("Images API", () => {
  it("returns 400 when no files are provided", async () => {
    const res = await request(app).post("/api/images");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
