import Cookies from "js-cookie";
import { getClassGradesUrl, getModuleInfoUrl } from "../routes.js";
import Class from "../Entities/Class"

class ClassManagement {

  static async getAllClasses(moduleId) {
    let data;
    let classData = [];
    await fetch(getModuleInfoUrl + moduleId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
    })
    .then((result) => result.json())
    .then((json) => (data = json));

    data.classes.forEach(element => {
      classData.push(new Class(element._id, element.name, "12am to 12pm"));
    });

    return classData;
  }

  static async getClass(classId) {
    let data;
    let classData = [];
    await fetch(getClassGradesUrl + classId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
    })
    .then((result) => result.json())
    .then((json) => (data = json));

    data.results.forEach(element => {
      classData.push({studentID: element[1], name: element[0], grade: element[3], rank: element[2]});
    });

    return classData;
  }
}

export default ClassManagement;
