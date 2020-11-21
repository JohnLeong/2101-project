import Component from "./comment.js"
import SummativeComment from "./summativeComment.js"
import FormativeComment from "./formativeComment.js"

class CommentFactory {

  static async createComment(componentId, commentBody, studentId, postedBy) {

    //Check for null parameters
    if (componentId == null || commentBody == null || postedBy == null) {
      return null;
    }

    //Find component
    var component = await Component.find({
      _id: componentId,
    }).exec();
    
    //Instantiate comment and return reference
    if (component.isComplete(studentId)) {
      return new SummativeComment(studentId, postedBy, commentBody);
    } else {
      return new FormativeComment(studentId, postedBy, commentBody);
    }
  }

}