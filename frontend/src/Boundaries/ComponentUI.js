import ComponentManagement from "../Control/ComponentManagement";
import SubComponentManagement from "../Control/SubComponentManagement";

class ComponentUI {
    static async displayAllComponents(moduleId) {
        return await ComponentManagement.getAllComponents(moduleId);
    }

    static async displayComponent(componentId) {
        return await ComponentManagement.getComponent(componentId);
    }

    static async displayAddComponentForm() {
        return true;
    }

    static async displayAllSubComponents() {
        return await SubComponentManagement.getAllSubComponents();
    }

    static async displaySubComponent(subcomponentId) {
        return await SubComponentManagement.getSubComponent(subcomponentId);
    }

    static validEntry() {
        return true;
    }

    static invalidEntry(message) {
        alert(message);
    }

    static async displayFileDialog(event, [submitting, setSubmitting], componentId) {
        // access to the file content
        let files = event.target.files;
        // access to file data
        let dataOutput = null;
        
        Array.from(files)
        .filter((file) => file.type === "application/vnd.ms-excel" || file.type === "text/csv")
        .forEach(async (file) => {
            dataOutput = await file.text();
            if (submitting === false) {
                setSubmitting(true);

                const results = await SubComponentManagement.importStudentMarks(componentId, dataOutput);
                if(results.includes("Error")){
                    setSubmitting(false);
                }
                console.log(results);
                alert(results);
                window.location.reload();
                return results;
            }
        });
    }

    static async displayEditMarksForm() {

    }
}

export default ComponentUI;