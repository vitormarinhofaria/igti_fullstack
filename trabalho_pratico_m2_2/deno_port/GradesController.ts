import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v6.4.0/mod.ts";

import * as GradesData from "./grades_data_controller.ts";
import { Grade } from "./Grade.ts";

export const GradesController = new Router();
//Endpoint 1
GradesController.post("/grades", async (context) => {
  console.log("Endpoint 1");

  const grade = await context.request.body({ type: "json" }).value;
  const gradeObj = await GradesData.AddNewGrade(grade.grade);
  context.response.status = 201;
  context.response.body = gradeObj;
});

//Endpoint 2
GradesController.put<{ id: string }>("/grades/:id", async (context) => {
  console.log("Endpoint 2");

  const grade = await context.request.body({ type: "json" }).value;
  const gradeId = parseInt(context.params.id);

  const gradeObj = await GradesData.UpdateGrade(grade, gradeId);

  if (gradeObj === undefined) {
    context.response.status = 404;
    context.response.body = { error: "Invalid ID" };
  }

  context.response.status = 200;
  context.response.body = gradeObj;
});

//Endpoint 3
GradesController.delete<{ id: string }>("/grades/:id", async (context) => {
  console.log("Endpoint 3");

  const gradeId = parseInt(context.params.id);

  const deletedGrade = await GradesData.DeleteGrade(gradeId);
  if (deletedGrade === undefined) {
    context.response.status = 404;
    context.response.body = { error: "ID not found" };
  }

  context.response.status = 200;
  context.response.body = deletedGrade;
});

//Endpoint 4
GradesController.get<{ id: string }>("/grades/:id", async (context) => {
  console.log("Endpoint 4");

  const gradeId = parseInt(context.params.id);
  const grade = await GradesData.GetGradeById(gradeId);

  if (grade === undefined) {
    context.response.status = 404;
    context.response.body = { error: "ID not found" };
  }

  context.response.status = 200;
  context.response.body = grade;
});

//Endpoint 5
GradesController.get("/grades/total/:student/:subject", async (context) => {
  console.log("Endpoint 5");

  const studentName = context.params.student;
  const subjectName = context.params.subject;

  const gradesArray = await GradesData.GetGradesArray();
  if (gradesArray === undefined) return undefined;

  const gradesTotal = gradesArray.filter((element) =>
    element.student === studentName && element.subject === subjectName
  ).reduce((accumulator, current) => {
    if (current.value !== undefined) return accumulator += current.value;
    return accumulator += 0;
  }, 0);

  context.response.status = 200;
  context.response.body = {
    student: studentName,
    subject: subjectName,
    total: gradesTotal,
  };
});

// //Endpoint 6
// GradesController.get("/media/:subject/:type", async (request, response) => {
//     console.log("Endpoint 6");

//     const subjectName = request.params.subject;
//     const typeName = request.params.type;

//     const gradesArray = await GradesData.GetGradesArray();

//     const filteredGrades = gradesArray.filter((element) => element.subject === subjectName && element.type === typeName);
//     const gradesTotal = filteredGrades.reduce((accumulator, current) => {
//         return accumulator += current.value;
//     }, 0);

//     const averrageGrade = gradesTotal / filteredGrades.length;

//     response.statusCode = 200;
//     response.json({ subject: subjectName, type: typeName, averrageGrade })
// });

// //Endpoint 7
// GradesController.get("/best3/:subject/:type", async (request, response) => {
//     console.log("Endpoint 7");

//     const subjectName = request.params.subject;
//     const typeName = request.params.type;

//     const gradesArray = await GradesData.GetGradesArray();

//     const filteredArr = gradesArray.filter((element) => {
//         return element.subject === subjectName && element.type === typeName;
//     }).sort((a, b) => {
//         return b.value - a.value;
//     }).filter((element, index, array) => {
//         return index < 3;
//     });

//     response.json(filteredArr);
// });

// GradesController.get("/", async (request, response) => {
//     const gradesArray = await GradesData.GetGradesArray();
//     response.statusCode = 200;
//     response.json(gradesArray);
// });

// //export { GradesRouter };
