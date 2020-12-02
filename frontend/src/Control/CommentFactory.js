import Cookies from 'js-cookie';
import { isCompleteUrl, createCommentUrl } from "../routes.js";
import SummativeComment from "../Entities/SummativeComment.js";
import FormativeComment from "../Entities/FormativeComment.js";

class CommentFactory {

  static async createComment(componentId, studentId, postedBy, body) {
    //Check for null parameters
    if (componentId == null || studentId == null || postedBy == null || body == null) {
      return null;
    }

    //read component to check if component is complete
    let isComplete;
      await fetch(isCompleteUrl + componentId + "/" + studentId, {
          method: "GET",
          headers: {
              Authorization:
              "Bearer " + Cookies.get('token'),
              "Content-Type": "application/json",
          },
      })
      .then((result) => result.json())
      .then((json) => (isComplete = json));

    // new object
    var newComment;
    if (isComplete) {  //true = summative, false = formative
      newComment = new SummativeComment(null, studentId, postedBy, body);
    } else {
      newComment = new FormativeComment(null, studentId, postedBy, body);
    }

    //insert into db
    let results;
    await fetch(createCommentUrl + componentId, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            commentType: isComplete,
            studentId: newComment.getStudentId(),
            postedBy: newComment.getPostedBy(),
            body: newComment.getBody(),
        }),
    })
    .then((result) => result.ok)
    .then((status) => {
        results = status;
        console.log(results);
    })
    .catch((err) => {
        results = err;
        console.error(results);
    });
    
    console.log(newComment.getCommentType() + " comments created!");
    
    // return true = successful, false = error
    return results;
  }
}

export default CommentFactory;