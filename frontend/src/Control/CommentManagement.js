import Cookies from 'js-cookie';
import { updateCommentUrl, getComponentCommentsUrl } from "../routes.js";
import Comment from "../Entities/Comment.js"
import Component from "../Entities/Component.js"

class CommentManagement {
  static async updateComment(comment) {
    await fetch(updateCommentUrl + comment.getId(), {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: comment.getBody(),
      }),
    });
  }

  static async getComponentComments(componentId) {
    let data;
    await fetch(getComponentCommentsUrl + componentId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((json) => (data = json));

    console.log(data.comments);
    //return new Comment(data.comments._id,data.comments.studentId,data.comments.postedBy,data.comments.body);
    return data.comments;
  }
}

export default CommentManagement;