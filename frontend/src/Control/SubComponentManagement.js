import Cookies from 'js-cookie';
import { createSubComponentUrl, updateSubComponentUrl, 
    getSubComponentUrl, updateStudentMarksUrl, importMarksUrl } from "../routes.js";
import Component from "../Entities/Component.js";
import SubComponent from "../Entities/Subcomponent.js";

class SubComponentManagement {
    static async createSubComponent(subcomponent, componentId) {
        await fetch(createSubComponentUrl + componentId, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: subcomponent.getName(),
                weightage: subcomponent.getWeightage(),
            }),
        })
        .then((result) => {
            if (result.ok) {
                console.log("Add subcomponent ok");
                return;
              } else {
                throw new Error("An error occurred");
              }
        })
        .catch((err) => {
            console.error("Error: " + err);
        });
    }
    
    //edit a subcomponent by id
    static async updateSubComponent(subcomponent) {
        await fetch(updateSubComponentUrl + subcomponent.getId(), {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: subcomponent.getName(),
                weightage: subcomponent.getWeightage(),
            }),
        });
    }

    // getting subcomponent by id
    static async getAllSubComponents() {
        let data;
        await fetch(getSubComponentUrl + "all",{
            method: "GET",
            headers: {
                Authorization:
                "Bearer " + Cookies.get('token'),
                "Content-Type": "application/json",
            },
        })
        .then((result) => result.json())
        .then((json) => (data = json));

        console.log(data);
        return data;
    }

    //Get a subcomponent by id
    static async getSubComponent(subcomponent) {
        let data;
        await fetch(getSubComponentUrl + subcomponent.getId(),{
            method: "GET",
            headers: {
                Authorization:
                "Bearer " + Cookies.get('token'),
                "Content-Type": "application/json",
            },
        })
        .then((result) => result.json())
        .then((json) => (data = json));

        return new SubComponent(data._id, data.name, data.weightage, data.studentMarks);
    }

    static async calculateGrade(subcomponent, studentId) {
        const marksPercentage = subcomponent.studentMarks[studentId];
        let grade;
        if (marksPercentage >= 84)
          grade = 'A';
        else if (marksPercentage >= 67)
          grade = 'B';
        else if (marksPercentage >= 57)
          grade = 'C';
        else if (marksPercentage >= 47)
          grade = 'D';
        else if (marksPercentage >= 37)
          grade = 'E';
        else
          grade = 'F';
    
        return grade;
    }

    static async getStudentMarks(subcomponent, studentId) {
        let data;
        await fetch(getSubComponentUrl + subcomponent.getId(),{
            method: "GET",
            headers: {
                Authorization:
                "Bearer " + Cookies.get('token'),
                "Content-Type": "application/json",
            },
        })
        .then((result) => result.json())
        .then((json) => (data = json));

        return data.studentMarks[studentId];
    }

    static async updateStudentMarks(subcomponentId, studentId, newStudentMarks) {
        let studentIdToMarks = {};
        studentIdToMarks[studentId] = newStudentMarks;

        console.log(subcomponentId);
        console.log(studentIdToMarks);

        await fetch(updateStudentMarksUrl + subcomponentId, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentMarks: studentIdToMarks, //user_studentObjectid: marks
            }),
        });
    }

    static async importStudentMarks(componentId, dataOutput) {
        let data, errCode;
        //var subcomponent = new SubComponent(2, "name", "weightage",dataOutput);
        await fetch(importMarksUrl + componentId, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                "Content-Type": "application/json",
            },
            // convert to JSON and send it as the PUT body
            body: JSON.stringify({ dataOutput }),
        })
        .then((result) => result.json())
        .then((json) => {
            data = json;
            console.log(data);
        })
        .catch((err) => {
            data = err;
            console.error(data);
        });
        return data;
    }
}

export default SubComponentManagement;