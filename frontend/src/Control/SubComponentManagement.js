import Cookies from 'js-cookie';
import { createSubComponentUrl, updateSubComponentUrl, 
    getSubComponentUrl, updateStudentMarksUrl, importMarksUrl } from "../routes.js";
import Component from "../Entities/component.js";
import SubComponent from "../Entities/subcomponent.js";

class SubComponentManagement {
    static async createSubComponent(componentId, name, weightage) {
        let data;
        // new object
        var subcomponent = new SubComponent(1, name, weightage,[]);
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
    static async getAllSubComponent() {
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

    static async calculateGrade(subcomponent) {
        return null;
    }

    static async getStudentMarks() {
        return null;
    }

    static async updateStudentMarks(subcomponent) {
        await fetch(updateStudentMarksUrl + subcomponent.getId(), {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentMarks: "", //user_studentObjectid: marks
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