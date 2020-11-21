
//External endpoints (backend)
export const backendUrl = "http://localhost:5000/";
export const loginUrl = backendUrl + "user/login";                              //POST
export const importMarksUrl = backendUrl + "subcomponent/new/importmarks/";
export const createComponentUrl = backendUrl + "component/new/"                 //POST, component/new/<moduleId>
export const getComponentUrl = backendUrl + "component/"                        //GET, component/<componentId>
export const updateComponentUrl = backendUrl + "component/"                     //PUT, component/<componentId>

//Internal (frontend)
export const modulesUrl = "/modules/";
