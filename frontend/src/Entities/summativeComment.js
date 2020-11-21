class SummativeComment extends Comment {
  constructor(studentId, postedBy, commentBody) {
    super(studentId, postedBy, commentBody);
    this.commentType = "summative";
  }

  getCommentType() {
    return this.commentType;
  }
}

export default SummativeComment;