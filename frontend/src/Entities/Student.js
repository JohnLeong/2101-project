import User from "./User";

class Student extends User {
  constructor(id, name, email, studentId) {
    super(id, name, email);
    this.studentId = studentId;
  }

  getStudentId() {
    return this.studentId;
  }
}

export default Student;
