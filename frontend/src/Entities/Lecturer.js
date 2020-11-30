import User from "./User";

class Lecturer extends User {
  constructor(id, name, email, lecturerId) {
    super(id, name, email);
    this.lecturerId = lecturerId;
  }

  getLecturerId() {
    return this.lecturerId;
  }
}

export default Lecturer;
