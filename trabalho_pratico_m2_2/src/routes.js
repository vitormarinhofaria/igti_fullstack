import express from "express";

import * as GradesData from "./grades_data_controller.js";

export const GradesController = express.Router();


//Endpoint 1
GradesController.post("/", async (request, response) => {
    console.log("Endpoint 1");

    const grade = request.body.grade;
    const gradeObj = await GradesData.AddNewGrade(grade);
    response.statusCode = 201;
    response.json(gradeObj);
});

//Endpoint 2
GradesController.put("/:id", async (request, response) => {
    console.log("Endpoint 2");

    const grade = request.body.grade;
    const gradeId = parseInt(request.params.id);

    const gradeObj = await GradesData.UpdateGrade(grade, gradeId);

    if (gradeObj === undefined) {
        response.statusCode = 404;
        response.json({ error: "Invalid ID" })
    }

    response.statusCode = 200;
    response.json(gradeObj);
})

//Endpoint 3
GradesController.delete("/:id", async (request, response) => {
    console.log("Endpoint 3");

    const gradeId = parseInt(request.params.id);

    const deletedGrade = await GradesData.DeleteGrade(gradeId);
    if (deletedGrade === undefined) {
        response.statusCode = 404;
        response.json({ error: "ID not found" });
    }

    response.statusCode = 200;
    response.json(deletedGrade);
});

//Endpoint 4
GradesController.get("/:id", async (request, response) => {
    console.log("Endpoint 4");

    const gradeId = parseInt(request.params.id);
    const grade = await GradesData.GetGradeById(gradeId);

    if (grade === undefined) {
        response.statusCode = 404;
        response.json({ error: "ID not found" });
    }

    response.statusCode = 200;
    response.json(grade);
});

//Endpoint 5
GradesController.get("/total/:student/:subject", async (request, response) => {
    console.log("Endpoint 5");

    const studentName = request.params.student;
    const subjectName = request.params.subject;

    const gradesArray = await GradesData.GetGradesArray();

    let gradesTotal = gradesArray.filter((element) => element.student === studentName && element.subject === subjectName).reduce((accumulator, current) => {
        return accumulator += current.value;
    }, 0);

    response.statusCode = 200;
    response.json({ student: studentName, subject: subjectName, total: gradesTotal });
});

//Endpoint 6
GradesController.get("/media/:subject/:type", async (request, response) => {
    console.log("Endpoint 6");

    const subjectName = request.params.subject;
    const typeName = request.params.type;

    const gradesArray = await GradesData.GetGradesArray();

    const filteredGrades = gradesArray.filter((element) => element.subject === subjectName && element.type === typeName);
    const gradesTotal = filteredGrades.reduce((accumulator, current) => {
        return accumulator += current.value;
    }, 0);

    const averrageGrade = gradesTotal / filteredGrades.length;

    response.statusCode = 200;
    response.json({ subject: subjectName, type: typeName, averrageGrade })
});

//Endpoint 7
GradesController.get("/best3/:subject/:type", async (request, response) => {
    console.log("Endpoint 7");

    const subjectName = request.params.subject;
    const typeName = request.params.type;

    const gradesArray = await GradesData.GetGradesArray();

    const filteredArr = gradesArray.filter((element) => {
        return element.subject === subjectName && element.type === typeName;
    }).sort((a, b) => {
        return b.value - a.value;
    }).filter((element, index, array) => {
        return index < 3;
    });

    response.json(filteredArr);
});

GradesController.get("/", async (request, response) => {
    const gradesArray = await GradesData.GetGradesArray();
    response.statusCode = 200;
    response.json(gradesArray);
});

//export { GradesRouter };