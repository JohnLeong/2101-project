class FormativeComment extends Comment {
  constructor(id, studentId, postedBy, body) {
    super(id, studentId, postedBy, body);
    this.commentType = "formative";
  }

  getCommentType() {
    return this.commentType;
  }
}

export default FormativeComment;