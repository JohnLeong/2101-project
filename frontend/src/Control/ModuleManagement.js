import Cookies from "js-cookie";
import Module from "../Entities/Module";
import { getModuleInfoUrl, getUserModulesUrl } from "../routes";

class ModuleManagement {
  static async getModule(moduleId) {
    let data;
    await fetch(getModuleInfoUrl + moduleId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
    })
    .then((result) => result.json())
    .then((json) => (data = json));

    return new Module(data._id, data.name, data.description);
  }

  static async getAllModules() {
    let data;
    await fetch(getUserModulesUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
    })
    .then((result) => result.json())
    .then((json) => (data = json));

    return data;
  }
}

export default ModuleManagement;
