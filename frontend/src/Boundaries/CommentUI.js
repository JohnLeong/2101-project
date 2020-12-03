import CommentFactory from "../Control/CommentFactory.js";
import CommentManagement from "../Control/CommentManagement.js"

class CommentUI {
    static async displayComments() {

    }

    static async addComment(componentId,studentIds,lectureId,commentBody) {
        let errCounter = 0;
        if(studentIds == "" || commentBody == "")
        {
            return ("ERROR!");
        }

        for (let index = 0; index < studentIds.length; ++index) {
            const studentId = studentIds[index];
            if(studentId != "")
            {
                const newComment = await CommentFactory.createComment(componentId,studentId,lectureId,commentBody);
                console.log(newComment);
                if(!newComment)
                {
                    ++errCounter;
                }
            }
        }

        if(errCounter > 0)
        {
            return (errCounter + " student(s) comments not added. Please check.");
        }
        else
        {
            return ("Successful");
        }
    }

    static async editComment(comment) {
        if(comment.getId() === "" || comment.getBody() === "") {
            return ("ERROR!");
        }
        await CommentManagement.updateComment(comment);
    }
}

export default CommentUI;