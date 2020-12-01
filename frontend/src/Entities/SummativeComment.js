import Comment from "../Entities/Comment.js";

class SummativeComment extends Comment {
  constructor(id, studentId, postedBy, body) {
    super(id, studentId, postedBy, body);
    this.commentType = "summative";
  }

  getCommentType() {
    return this.commentType;
  }
}

export default SummativeComment;