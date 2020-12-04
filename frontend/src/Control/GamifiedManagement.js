import CommentManagement from "./CommentManagement";
import ComponentManagement from "./ComponentManagement";
import SubComponentManagement from "./SubComponentManagement";

class GamifiedManagement {
    static async getComponentsInfo(moduleId) {
        return await ComponentManagement.getAllComponents(moduleId);
    }

    static async getSubComponentsInfo() {
        return await SubComponentManagement.getAllSubComponents();
    }

    static async getCommentsInfo(componentId) {
        return await CommentManagement.getComponentComments(componentId);
    }
}

export default GamifiedManagement;
