import { json } from "express";
import { promises as fs } from "fs";

const gradesPath = "./grades.json";

export async function AddNewGrade(grade) {
    const gradesJson = await GetGradesJson();
    const gradeObj = {
        id: gradesJson.nextId,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: new Date()
    }
    gradesJson.grades.push(gradeObj);
    gradesJson.nextId += 1;
    await SaveGradesJson(gradesJson);
    return gradeObj;
}

export async function UpdateGrade(grade, id) {
    const gradesJson = await GetGradesJson();

    const gradeObj = {
        id,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: new Date()
    }

    let gradePosition = 0;
    const gradeToUpdate = gradesJson.grades.find((g, i, a) => {
        gradePosition = i;
        return g.id === gradeObj.id;
    });

    if (gradeToUpdate === undefined) {
        console.log("Could not find grade with id: " + gradeObj.id);
        return undefined;
    }

    gradeObj.timestamp = gradeToUpdate.timestamp;
    gradesJson.grades[gradePosition] = gradeObj;
    await SaveGradesJson(gradesJson);

    return gradeObj;
}

export async function DeleteGrade(gradeId) {
    const gradesJson = await GetGradesJson();
    let gradePosition = 0;

    const gradeToDelete = gradesJson.grades.find((e, i, a) => {
        gradePosition = i;
        return e.id === gradeId;
    });

    if (gradeToDelete === undefined) {
        return undefined;
    }

    gradesJson.grades.splice(gradePosition, 1);
    await SaveGradesJson(gradesJson);

    return gradeToDelete;
}

export async function GetGradeById(gradeId) {
    const gradesArray = await GetGradesArray();
    const grade = gradesArray.find((e) => {
        return e.id === gradeId;
    });

    return grade;
}

export async function GetGradesArray() {
    return (await GetGradesJson()).grades;
}

async function GetGradesJson() {
    return JSON.parse(await fs.readFile(gradesPath));
}

async function SaveGradesJson(gradesObj) {
    const gradesJsonString = JSON.stringify(gradesObj);
    await fs.writeFile(gradesPath, gradesJsonString);
}
