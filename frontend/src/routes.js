/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Admin layout
import DashboardPage from "./Pages/Dashboard.js";
import ComponentView from "./Pages/ComponentView.js";
import ClassView from "./Pages/ClassView.js"
import ClassList from "./Pages/ClassGrades";

//External endpoints (backend)
export const backendUrl = "http://localhost:5000/";

export const loginUrl = backendUrl + "user/login";                              //POST

export const createComponentUrl = backendUrl + "component/new/"                 //POST, component/new/<moduleId>
export const getComponentUrl = backendUrl + "component/"                        //GET, component/<componentId>
export const updateComponentUrl = backendUrl + "component/"                     //PUT, component/<componentId>
export const getUserModulesUrl = backendUrl + "module/usermodules/"             //GET
export const getModuleInfoUrl = backendUrl + "module/"                          //GET module/<moduleId>
export const getClassGradesUrl = backendUrl + "component/lecturer/grades/"     //GET component/lecturer/grades/<classId>

export const createSubComponentUrl = backendUrl + "subcomponent/new/";                  //POST, subcomponent/new/<componentId>
export const updateSubComponentUrl = backendUrl + "subcomponent/";                      //PUT, subcomponent/<subcomponentId>
export const getSubComponentUrl = backendUrl + "subcomponent/";                         //GET, subcomponent/<subcomponentId>
export const updateStudentMarksUrl = backendUrl + "subcomponent/edit/studentmarks/";    //PUT, subcomponent/edit/studentmarks/<subcomponentId>
export const importMarksUrl = backendUrl + "subcomponent/new/importmarks/";             //PUT, subcomponent/new/importmarks/<componentId>
// getStudentMarks()

//Internal (frontend)
export const modulesUrl = "/admin/dashboard";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/componentgrades",
    name: "Component View",
    icon: "content_paste",
    component: ComponentView,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/moduleclasses/:moduleId",
    name: "Classes",
    icon: "content_paste",
    component: ClassView,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/classgrades/:classId",
    name: "Classes grades",
    icon: "content_paste",
    component: ClassList,
    layout: "/admin",
    hidden: true,
  },
];

export default dashboardRoutes;
