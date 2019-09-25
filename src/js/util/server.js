const HOSTNAME = window.location.hostname;
const SERVER_PORT = 9000;

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
        .then(response => response.json())
        .then(response => {
            console.log(`server to ${request.toUpperCase()}  : `, response);
            return response;
        })
}

export function basicPOST(controller, request, body) {
    return customPOST(controller, request, body)
        .then(response => response.status === "SUCCESS");
}

export function customGET(controller, request, keys, values) {
    let parameters = "";
    if(keys && values) {
        for (let i = 0; i < keys.length; i++) {
            parameters += `${keys[i]}=${values[i]}&`;
        }
    }

    return fetch(`${API_ADDRESS}${controller}/${request}?${parameters}`)
        .then(response => response.json())
        .then(response => {
            console.log(`server to ${request.toUpperCase()}  : `, response);
            return response;
        });
}

export function basicGET(controller, request, keys, values) {
    return customGET(controller, request, keys, values)
        .then(response => response.status === "SUCCESS");
}