import Cookies from 'js-cookie'
import { getClaims } from '../TokenClaims';

class AuthenticationManagement {
    static authenticateUser(allowedRoles) {
        const isLoggedIn = Cookies.get("token") != null;
        const isAuthorized = allowedRoles.includes(getClaims().role);

        return isLoggedIn && isAuthorized;
    }
}

export default AuthenticationManagement;
