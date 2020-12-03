import Cookies from 'js-cookie';
import { createComponentUrl, getComponentUrl, getModuleComponentsUrl, updateComponentUrl } from "../routes.js";
import Component from "../Entities/Component.js"

class ComponentManagement {
  static async addComponent(component, moduleId) {
    await fetch(createComponentUrl + moduleId, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: component.getName(),
        componentType: component.getType(),
        weightage: component.getWeightage(),
      }),
    })
  }

  static async updateComponent(component) {
    await fetch(updateComponentUrl + component.getId(), {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: component.getName(),
        componentType: component.getType(),
        weightage: component.getWeightage(),
      }),
    })
  }

  static async getAllComponents(moduleId) {
    let data;
    await fetch(getModuleComponentsUrl + moduleId, {
      method: "GET",
      headers: {
        Authorization:
        "Bearer " + Cookies.get('token'),
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((json) => (data = json));

    return data;
  }

  static async getComponent(componentId) {
    let data;
    await fetch(getComponentUrl + componentId, {
      method: "GET",
      headers: {
        Authorization:
        "Bearer " + Cookies.get('token'),
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((json) => (data = json));

    return new Component(data._id, data.name, data.componentType, data.weightage);
  }

  static calculateGrade(subcomponents, studentId) {
    const marksPercentage = ComponentManagement.calculateMarksPercentage(subcomponents, studentId);
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

  static calculateMarksPercentage(subcomponents, studentId) {
    let scoredMarks = 0;
    let maximumMarks = 0;

    for (let i = 0; i < subcomponents.length; ++i) {
      if (subcomponents[i].weightage === 0) {
        continue;
      }

      let marks = subcomponents[i].getStudentMarks()[studentId];
      maximumMarks += 100 * subcomponents[i].weightage;

      if (typeof marks !== "undefined") {
        scoredMarks += marks * subcomponents[i].weightage;
      }
    }

    return scoredMarks / maximumMarks;
  }
}

export default ComponentManagement;