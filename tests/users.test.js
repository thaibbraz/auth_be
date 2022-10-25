const express = require("express");
const app = express();
const request = require("supertest");
const port = process.env.PORT || 5000;

app.listen(port);
describe("Private routes", () => {
  describe("GET /users without auth", () => {
    it("Requires login", async () => {
      const response = await request("http://localhost:3000").get("/users");
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    });
  });

  describe("GET /users with auth", () => {
    let token = "";
    it("Requires login", async () => {
      const response = await request("http://localhost:3000")
        .post("/users/login")
        .send({
          username: "test",
        });
      expect(response.statusCode).toBe(200);
      token = response.body;
    });

    it("Authorizes only correct users", async () => {
      const response = await request("http://localhost:3000")
        .get("/users")
        .set("Authorization", "Bearer " + token.accessToken);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Here is your Members Only content from the server...",
      });
    });
  });
});
