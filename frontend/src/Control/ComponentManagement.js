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

  //Tested and working
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

  static calculateGrade(component) {
    return null;
  }
}

export default ComponentManagement;