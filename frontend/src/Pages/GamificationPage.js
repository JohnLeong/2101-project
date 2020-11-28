import React, { Fragment, useState } from "react";
import Unity, { UnityContext  } from "react-unity-webgl";
import Cookies from 'js-cookie'

const GamificationPage = () => {
  const [unityContext,] = useState(new UnityContext({
    loaderUrl: process.env.PUBLIC_URL + "/Build3/newest.loader.js",
    dataUrl: process.env.PUBLIC_URL + "/Build3/newest.data",
    frameworkUrl: process.env.PUBLIC_URL + "/Build3/newest.framework.js",
    codeUrl: process.env.PUBLIC_URL + "/Build3/newest.wasm"
      }));

  unityContext.on("loaded", () => {
    console.log("Gamification Loaded");
  });

  unityContext.on("OnGameManagerLoaded", () => {
    console.log("Gamemanager was loaded");
    unityContext.send(
      "GameManager", 
      "StartGame", 
      "Bearer " + Cookies.get("token")
    );
  });

  return (
    <Fragment>
      <Unity width={"100%"} height={"100%"} unityContext={unityContext} />
    </Fragment>
  );
};

export default GamificationPage;

// import React, { Component, Fragment } from "react";
// import ReactDOM from "react-dom";
// import Unity, { UnityContext } from "react-unity-webgl";
// import "./index.css";

// class GamificationPage extends Component {
//   constructor() {
//     super();
//     this.speed = 30;
//     this.state = {
//       degrees: 0,
//       message: "-",
//       showUnity: true,
//     };
//     // this.unityContext = new UnityContext({
//     // loaderUrl: process.env.PUBLIC_URL + "/build/myunityapp.loader.js",
//     // dataUrl: process.env.PUBLIC_URL + "/build/myunityapp.data",
//     // frameworkUrl: process.env.PUBLIC_URL + "/build/myunityapp.framework.js",
//     // codeUrl: process.env.PUBLIC_URL + "/build/myunityapp.wasm"
//     // });
//     this.unityContext = new UnityContext({
//     loaderUrl: process.env.PUBLIC_URL + "/Build3/newest.loader.js",
//     dataUrl: process.env.PUBLIC_URL + "/Build3/newest.data",
//     frameworkUrl: process.env.PUBLIC_URL + "/Build3/newest.framework.js",
//     codeUrl: process.env.PUBLIC_URL + "/Build3/newest.wasm"
//       });
//     // this.unityContext.on("RotationDidUpdate", (degrees) => {
//     //   this.setState({ degrees: Math.round(degrees) });
//     // });
//     // this.unityContext.on("Say", (message) => {
//     //   this.setState({ message });
//     // });
//   }
//   render() {
//     return (
//       <Fragment>
//         <h1>React UnityWebGL</h1>
//         <p>Rotation {this.state.degrees}deg</p>
//         <p>Last Said {this.state.message}</p>
//         {/* <button
//           children={"Start Rotation"}
//           onClick={() => this.unityContext.send("mesh-crate", "StartRotation")}
//         />
//         <button
//           children={"Stop Rotation"}
//           onClick={() => this.unityContext.send("mesh-crate", "StopRotation")}
//         />
//         <button
//           children={"Faster Rotation"}
//           onClick={() => {
//             this.speed += 5;
//             this.unityContext.send(
//               "mesh-crate",
//               "SetRotationSpeed",
//               this.speed
//             );
//           }}
//         />
//         <button
//           children={"Slower Rotation"}
//           onClick={() => {
//             this.speed -= 5;
//             this.unityContext.send(
//               "mesh-crate",
//               "SetRotationSpeed",
//               this.speed
//             );
//           }}
//         />
//         <button
//           children={"(re)Unmount"}
//           onClick={() => this.setState({ showUnity: !this.state.showUnity })}
//         /> */}
//         <div>
//           {this.state.showUnity === true ? (
//             <Unity width={"100%"} unityContext={this.unityContext} />
//           ) : (
//             <div />
//           )}
//         </div>
//       </Fragment>
//     );
//   }
// }

//export default GamificationPage;


// import React, { Component, Fragment } from "react";
// import ReactDOM from "react-dom";
// import Unity, { UnityContext } from "react-unity-webgl";
// import "./index.css";

// class GamificationPage extends Component {
//   constructor() {
//     super();
//     this.speed = 30;
//     this.state = {
//       degrees: 0,
//       message: "-",
//       showUnity: true,
//     };
//     this.unityContext = new UnityContext({
//     loaderUrl: process.env.PUBLIC_URL + "/Build3/newest.loader.js",
//     dataUrl: process.env.PUBLIC_URL + "/Build3/newest.data",
//     frameworkUrl: process.env.PUBLIC_URL + "/Build3/newest.framework.js",
//     codeUrl: process.env.PUBLIC_URL + "/Build3/newest.wasm"
//       });
//           this.unityContext.on("OnGameManagerLoaded", () => {
//       console.log("HERE");
//     });
//   }
//   render() {
//     return (
//       <Fragment>
//         <h1>React UnityWebGL</h1>
//         <button
//           onClick={() => this.unityContext.send(
//                           "TestingSend",
//                           "TestMessage",
//                         )}
//         /> 
//         <div>
//           {this.state.showUnity === true ? (
//             <Unity width={"100%"} unityContext={this.unityContext} />
//           ) : (
//             <div />
//           )}
//         </div>
//       </Fragment>
//     );
//   }
// }

// export default GamificationPage;