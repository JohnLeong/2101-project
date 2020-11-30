import ComponentManagement from "../Control/ComponentManagement";
import SubComponentManagement from "../Control/SubComponentManagement";

class ComponentUI {
    static async displayAllComponents() {
        
    }

    static async displayComponent() {

    }

    static async displayAddComponentForm() {

    }

    static async displayAllSubComponents() {

    }

    static async displaySubComponent() {

    }

    static async validEntry() {
        
    }

    static async invalidEntry() {
        return 0
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
                return results;
            }
        });
    }

    static async displayEditMarksForm() {

    }
}

export default ComponentUI;