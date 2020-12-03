import Cookies from "js-cookie";
import Module from "../Entities/Module";
import { getModuleInfoUrl } from "../routes";

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
}

export default ModuleManagement;
