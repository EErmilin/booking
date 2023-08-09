/**
 *
 * @param objectFilters
 * @returns {string}
 */

export function dispatchObjectToUrl(objectFilters) {
    let filterString = []
    for (let key in objectFilters) {
        if (!objectFilters[key]) continue
        filterString.push(`${key}=${objectFilters[key]}`)
    }

    return filterString.join('&')
}