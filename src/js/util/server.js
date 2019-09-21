const HOSTNAME = window.location.hostname;
const SERVER_PORT = 8080;

export const API_ADDRESS = `http://${HOSTNAME}:${SERVER_PORT}/api/`;

export function customPOST(controller, request, body) {
    return fetch(`${API_ADDRESS}${controller}/${request}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: body
        }
    )
        .then(response => response.text())
        .then(response => {
        console.log(`server to ${request.toUpperCase()}  : `, response);
        return response;
    })
}

export function customGET(controller, request, keys, values) {
    let parameters = "";
    for(let i = 0; i < keys.length; i++) {
        parameters += `${keys[i]}=${values[i]}&`;
    }

    return fetch(`${API_ADDRESS}${controller}/${request}?${parameters}`)
        .then(response => response)
        .then(response => {
        console.log(`server to ${request.toUpperCase()}  : `, response);
        return response;
    })
}