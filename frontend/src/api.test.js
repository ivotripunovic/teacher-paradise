import {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  addClassDate,
  deleteClassDate
} from "./api";

describe("API calls", () => {
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
  // test("Create User", () => {
  //   const result = await createTeacher({ email: 'ivo@car.com', password:'pa55w0rd' });
  //   expect(result.data).toBe({password: "password", email: 'ivo@car.com'})
  // });

  // test("loginOK", () => {
  //   const result = await login({ email: 'ivo@car.com', password:'pa55w0rd' });
  //   expect(result.status).toBe(200);
  //   expect(result.data).toBeTruthy();
  // });

  // test("loginFailed"); 
  // test("renewToken");
  // test("logout");
});
