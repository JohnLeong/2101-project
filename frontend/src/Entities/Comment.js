class Comment {
  constructor(id, studentId, postedBy, body) {
    this.id = id;
    this.studentId = studentId;
    this.postedBy = postedBy;
    this.body = body;
  }

  getId() {
    return this.id;
  }
  getStudentId() {
    return this.studentId;
  }
  getPostedBy() {
    return this.postedBy;
  }
  getBody() {
    return this.body;
  }
  getCommentType() {
    return null;
  }

  setStudentId(studentId) {
    this.studentId = studentId;
  }
  setPostedBy(postedBy) {
    this.postedBy = postedBy;
  }
  setBody(body) {
    this.body = body;
  }
}

export default Comment;