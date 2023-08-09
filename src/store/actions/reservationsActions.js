import {SELECT_RESERVATION} from "./actionsType";

export const selectReservation = function (reservation) {
    return {
      type: SELECT_RESERVATION,
      reservation
    }
};
