import ComponentManagement from "../Control/ComponentManagement";
import ModuleManagement from "../Control/ModuleManagement";

class ModuleUI {
    async displayAllModules() {
        return await ModuleManagement.getAllModules();
    }

    async displayModuleInformation(moduleId) {
        return await ModuleManagement.getModule(moduleId);
    }

    async displayComponentsInModule(moduleId) {
        return await ComponentManagement.getAllComponents(moduleId);
    }
}

export default ModuleUI;
