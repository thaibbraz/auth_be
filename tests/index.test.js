const express = require("express");
const app = express();
const request = require("supertest");
const port = process.env.PORT || 2000;

app.listen(port);
describe("public routes", () => {
  describe("GET/ ", () => {
    it("Allow any user to access this content", async () => {
      const response = await request("http://localhost:3000").get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Welcome to the homepage! Try ´/users´ for private routes",
      });
      expect(response.body.error).toBe(undefined);
    });
  });

  describe("POST/ ", () => {
    it("Allow any user to post content", async () => {
      const response = await request("http://localhost:3000").post("/");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Accessed the precious resources!",
      });
      expect(response.body.error).toBe(undefined);
    });
  });
});
