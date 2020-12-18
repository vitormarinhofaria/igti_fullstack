//import {  } from "https://deno.land/std@0.81.0/fs/mod.ts";
import { Grade } from "./Grade.ts";
const gradesPath = "./grades.json";

export async function AddNewGrade(grade: Grade) {
  const gradesJson = await GetGradesJson();
  if (
    gradesJson.grades === undefined || gradesJson.nextId === undefined
  ) {
    return undefined;
  }

  const gradeObj: Grade = {
    id: gradesJson.nextId,
    student: grade.student,
    subject: grade.subject,
    type: grade.type,
    value: grade.value,
    timestamp: new Date(),
  };

  gradesJson.grades.push(gradeObj);
  gradesJson.nextId += 1;
  await SaveGradesJson(gradesJson);

  return gradeObj;
}

export async function UpdateGrade(grade: Grade, id: number) {
  const gradesJson = await GetGradesJson();
  if (gradesJson.grades === undefined) return undefined;

  const gradeObj: Grade = {
    id,
    student: grade.student,
    subject: grade.subject,
    type: grade.type,
    value: grade.value,
    timestamp: new Date(),
  };

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

export async function DeleteGrade(gradeId: number) {
  const gradesJson = await GetGradesJson();
  if (gradesJson.grades === undefined) {
    return undefined;
  }

  let gradePosition = 0;

  const gradeToDelete = gradesJson.grades.find((e: Grade, i: number) => {
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

export async function GetGradeById(
  gradeId: number,
): Promise<Grade | undefined> {
  const gradesArray = await GetGradesArray();

  if (gradesArray !== undefined) {
    const grade = gradesArray.find((e) => {
      return e.id === gradeId;
    });
    return grade;
  }
}

export async function GetGradesArray(): Promise<Grade[] | undefined> {
  return (await GetGradesJson()).grades;
}

async function GetGradesJson(): Promise<GradesJson> {
  const file = await Deno.readFile(gradesPath);
  const text = new TextDecoder().decode(file);
  return JSON.parse(text);
}

async function SaveGradesJson(gradesObj: GradesJson) {
  const gradesJsonString = new TextEncoder().encode(JSON.stringify(gradesObj));
  await Deno.writeFile(gradesPath, gradesJsonString);
}

class GradesJson {
  nextId: number | undefined;
  grades: Grade[] | undefined;
}
