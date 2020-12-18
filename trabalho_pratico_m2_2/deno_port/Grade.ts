export class Grade {
  id: number | undefined;
  student: string | undefined;
  subject: string | undefined;
  type: string | undefined;
  value: number | undefined;
  timestamp: Date | undefined;

  constructor(
    id: number,
    student: string | undefined,
    subject: string | undefined,
    type: string | undefined,
    value: number | undefined,
    timestamp: Date,
  ) {
    this.id = id;
    this.student = student;
    this.subject = subject;
    this.type = type;
    this.value = value;
    this.timestamp = timestamp;
  }
}

// export class GradePO{
//     student: string | undefined;
//     subject: string | undefined;
//     type: string | undefined;
//     value: number | undefined;
// }

// export function toGrade(gradePo: GradePO, id: number, timestamp: Date): Grade{
//     return new Grade(id, gradePo.student, gradePo.subject, gradePo.type, gradePo.value, timestamp);
// }
