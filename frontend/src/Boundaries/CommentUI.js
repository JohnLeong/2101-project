import CommentFactory from "../Control/CommentFactory";
import ComponentManagement from "../Control/ComponentManagement";
import ComponentUI from "./ComponentUI";

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

    static async editComment() {
        
    }
}

export default CommentUI;