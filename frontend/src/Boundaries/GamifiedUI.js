import GamifiedManagement from "../Control/GamifiedManagement";

class GamifiedUI {
    async displayComponents() {
        return await GamifiedManagement.getComponentsInfo();
    }

    async displayComponentInfo(componentId) {
        const components = await GamifiedManagement.getComponentsInfo();
        for (let i = 0; i < components.length; ++i) {
            if (components[i]._id == componentId){
                return components[i];
            }
        }
        return null;
    }

    async displaySubComponentInfo(subcomponentId) {
        const subcomponents = await GamifiedManagement.getSubComponentsInfo();
        for (let i = 0; i < subcomponents.length; ++i) {
            if (subcomponents[i]._id == subcomponentId){
                return subcomponents[i];
            }
        }
        return null;
    }
}

export default GamifiedUI;
