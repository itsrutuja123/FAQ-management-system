const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const FAQ = require("../models/FAQ");
const mongoose = require("mongoose");

chai.use(chaiHttp);
const { expect } = chai;

describe("FAQ API", () => {
  before(async () => {
    // Ensure MongoDB is connected before running tests
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await FAQ.deleteMany({}); // Clean database before each test
  });

  afterEach(async () => {
    await FAQ.deleteMany({}); // Clean database after each test
  });

  after(async () => {
    await mongoose.connection.close(); // Close DB connection after all tests
    server.close(); // Shutdown server after tests
  });

  it("should create a new FAQ", async () => {
    const res = await chai
      .request(server)
      .post("/api/faqs")
      .send({ question: "What is Node.js?", answer: "A runtime environment for JavaScript." });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
  });

  it("should get FAQs in English", async () => {
    await FAQ.create({ question: "What is Node.js?", answer: "A runtime environment for JavaScript." });

    const res = await chai.request(server).get("/api/faqs?lang=en");

    expect(res.status).to.equal(200);
    expect(res.body[0].question).to.equal("What is Node.js?");
  });
});
