class Comment {
  constructor(studentId, postedBy, commentBody) {
    this.studentId = studentId;
    this.postedBy = postedBy;
    this.commentBody = commentBody;
  }

  getStudentId() {
    return this.studentId;
  }
  getPostedBy() {
    return this.postedBy;
  }
  getCommentBody() {
    return this.commentBody;
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
  setCommentBody(commentBody) {
    this.commentBody = commentBody;
  }
}

export default Comment;