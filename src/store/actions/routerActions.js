import {
    START_REQUEST, STOP_REQUEST
} from "./actionsType";

export function startRequest() {
    return {
        type: START_REQUEST,
    }
}

export function stopRequest() {
    return {
        type: STOP_REQUEST,
    }
}