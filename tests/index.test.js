const express = require("express");
const app = express();
const request = require("supertest");
const port = process.env.PORT || 5000;

app.listen(port);
let auth = "";
// const { ensureUserLoggedIn } = require("../middleware/guards");

describe("public route: GET/ ", () => {
  it("should return 200", async () => {
    const response = await request("http://localhost:3000").get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to the homepage! Try ´/users´ for private routes",
    });
    expect(response.body.error).toBe(undefined);
  });
});

describe("public route: POST/ ", () => {
  it("should return 200", async () => {
    const response = await request("http://localhost:3000").post("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Accessed the precious resources!",
    });
    expect(response.body.error).toBe(undefined);
  });
});
const agent = request.agent(app);

describe("GET /users without auth", () => {
  it("requires login", async () => {
    const response = await request("http://localhost:3000").get("/users");
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });
  describe("GET /users with auth", () => {
    let token = "";
    it("requires login", async () => {
      const response = await request("http://localhost:3000")
        .post("/users/login")
        .send({
          username: "test",
        });
      expect(response.statusCode).toBe(200);
      token = response.body;
    });

    it("authorizes only correct users", async () => {
      console.log("TOKEN", token.accessToken);
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
