import ComponentManagement from "./ComponentManagement";
import SubComponentManagement from "./SubComponentManagement";

class GamifiedManagement {
    static async getComponentsInfo(moduleId) {
        return await ComponentManagement.getAllComponents(moduleId);
    }

    static async getSubComponentsInfo() {
        return await SubComponentManagement.getAllSubComponents();
    }

    static async getCommentsInfo() {
        
    }
}

export default GamifiedManagement;
