import Component from "./Comment.js"
import SummativeComment from "./SummativeComment.js"
import FormativeComment from "./FormativeComment.js"

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