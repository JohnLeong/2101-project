import Cookies from 'js-cookie'

export function getClaims() {
    const token = Cookies.get("token");
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2FybWVsYSBDYWxsaWNvYXQiLCJlbWFpbCI6ImNhcm1lbGFjYWxsaWNvYXRAc2l0LnNpbmdhcG9yZXRlY2guZWR1LnNnIiwidXNlcklkIjoiNWY4ZDM0MmQ5YzAwNDk0OTljYmM4NmM3Iiwicm9sZSI6MiwiaWF0IjoxNjAzMTAyNzM4fQ.-wOGyA7rWhQMXy7WMZkl78ITeOvSjkuge0ytgOOl310";

    if (token == null){
        return {};
    }

    return JSON.parse(atob(token.split('.')[1]));
}