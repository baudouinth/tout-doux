import Cookies from "universal-cookie";

export const cookies = new Cookies();

export function api_request(location, args = {}) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };
    const jwt = cookies.get("jwt");
    if (jwt !== undefined) {
        headers["x-access-tokens"] = jwt;
    }

    return fetch(
        "http://localhost:5001/api/" + location + "?" + new URLSearchParams(args.params),
        {
            method: args.method || "GET",
            headers: Object.assign({}, headers, args.headers),
            body: args.body ? JSON.stringify(args.body) : null,
        }
    );

}

export async function current_user() {
    const jwt = cookies.get("jwt");
    if (jwt === undefined) {
        return undefined;
    }
    return await api_request("user/current")
        .then(response => {
            if (response.ok) return response.json().then(body => body.username);
            else return undefined;
        });
}

export function logout() {
    cookies.remove("jwt");
}
