import {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  addClassDate,
  deleteClassDate,
  createUser,
  login
} from "./api";

describe("API calls", () => {
  beforeAll(async () => {
    await login({ user: "ivo", pass: "secret" });
  });
  
  test("getStudents", async () => {
    const result = await getStudents();
    expect(result.status).toBe(200);
  });

  test("createStudent", async () => {
    const result = await createStudent("Ivo");
    expect(result.status).toBe(200);
    expect(result.data.name).toBe("Ivo");
  });

  test("getStudent by id", async () => {
    const result = await getStudent(1);
    expect(result.data.name).toBeTruthy();
    expect(result.data.dates).toBeTruthy();
  });

  test("Update student", async () => {
    const result = await updateStudent({ id: 1, name: "Tana" });
    expect(result.data.name).toBe("Tana");
  });

  test("Add class date", async () => {
    const result = await addClassDate({ studentId: 1, date: "2010-12-25" });
    expect(result.status).toBe(200);
  });

  test("Delete class date", async () => {
    const result = await deleteClassDate({ studentId: 1, date: "2010-12-25" });
    expect(result.status).toBe(204);
  });
});

describe("Autenication", () => {
  test("Create User", async () => {
    try {
      const result = await createUser({ user: "teacher", pass: "s3cr3t" });
      expect(result.status).toBe(201);
      expect(result.data.user).toBe("teacher");
    } catch (e) {
      // or it is already created
      expect(e.response.status).toBe(400);
    }
  });

  test("loginOK", async () => {
    const result = await login({ user: "teacher", pass: "s3cr3t" });
    expect(result.status).toBe(200);
    expect(result.data.token).toBeTruthy();
  });

  test("loginFailed", async () => {
    try {
      const result = await login({ user: "teacherWrong", pass: "s3cr3t" });
      expect(result).toBeNull();
    } catch (e) {
      expect(e.response.status).toBe(401);
      expect(e.response.data).toBe("Abort");
    }
  });

  test("loginPasswordFailed", async () => {
    try {
      const result = await login({ user: "teacher", pass: "wrong" });
      expect(result).toBeNull();
    } catch (e) {
      expect(e.response.status).toBe(500);
    }
  });

  // test("renewToken");
  // test("logout");
});
