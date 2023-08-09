

export const getBadTypeTitle = (type) => {
    switch (type) {
        case 2:
            return "reservations.beds.singleBed"
        case 3:
            return "reservations.beds.bunkBed"
        default:
            return "reservations.beds.doubleBed"
    }

}