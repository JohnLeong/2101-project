import ClassManagement from "../Control/ClassManagement";

class ClassUI {
    async displayAllClasses(moduleId) {
        return await ClassManagement.getAllClasses(moduleId);
    }

    async displayClassInformation(classId) {
        return await ClassManagement.getClass(classId);
    }
}

export default ClassUI;
