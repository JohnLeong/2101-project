import AuthenticationManagement from "../Control/AuthenticationManagement";

class AuthenticationUI {
    displayAuthentication(allowedRoles) {
        return AuthenticationManagement.authenticateUser(allowedRoles);
    }
}

export default AuthenticationUI;
