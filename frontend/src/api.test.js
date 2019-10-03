import { getStudents, createStudent } from "./api";

test("Api getStudents", async () => {
  const result = await getStudents();
  expect(result.status).toBe(200);
});

test("Api createStudent", async () => {
  const result = await createStudent("Ivo");
  expect(result.status).toBe(200);
  expect(result.data.name).toBe("Ivo");
});
