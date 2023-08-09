export function DispatchUrlToObject (){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams
}