class FormativeComment extends Comment {
  constructor(studentId, postedBy, commentBody) {
    super(studentId, postedBy, commentBody);
    this.type = "formative";
  }

  getCommentType() {
    return this.commentType;
  }
}

export default FormativeComment;