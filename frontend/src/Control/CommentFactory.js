import Component from "../Entities/Comment.js";
import SummativeComment from "../Entities/SummativeComment.js";
import FormativeComment from "../Entities/FormativeComment.js";

class CommentFactory {

  static async createComment(componentId, studentId, postedBy, body) {

    //Check for null parameters
    if (componentId == null || studentId == null || postedBy == null || body == null) {
      return null;
    }

    //TODO: edit to the correct flow
    //Find component
    var component = await Component.find({
      _id: componentId,
    }).exec();
    
    console.log(component);

    //Instantiate comment and return reference
    if (component.isComplete(studentId)) {
      return new SummativeComment(null, studentId, postedBy, body);
    } else {
      return new FormativeComment(null, studentId, postedBy, body);
    }
  }
}

export default CommentFactory;