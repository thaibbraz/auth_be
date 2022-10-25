const express = require("express");
const app = express();
const request = require("supertest");
const port = process.env.PORT || 5000;

app.listen(port);

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
describe("private route: GET/ ", () => {
  it("should return 401 - unauthorized", async () => {
    const response = await request("http://localhost:3000").get("/users");
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("Token should exist", async () => {
    const response = await request("http://localhost:3000").get("/users");

    console.log("response", response);
    expect(
      agent
        .get("Authorization")
        .set(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVXNlciAxIiwiaWF0IjoxNjY2NTU0Njk2fQ.wcuadZArRojjiD-15NGEwCqHmE4Vv85uKVcV7s-WMF8"
        )
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });
});
