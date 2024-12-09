import request from "supertest";
import app from "..";
import prisma from "../prisma";

describe("GET /api/users", () => {
  const sampleUser = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Dine",
      email: "janedine@gmail.com",
    },
  ];

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    const user = await prisma.user.findMany();
    if (user.length === 0) {
      await prisma.user.createMany({
        data: sampleUser,
      });
    }
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {},
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should retur an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "ok",
      users: sampleUser.map((item) => {
        return {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
        };
      }),
    });
  });
});
