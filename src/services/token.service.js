function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

class TokenService {
    #token = localStorage.getItem("token");
    #tokenData;
    #tokenRefresh;

    #isPendingRefresh = false;
    #requestWithNotAuth = []


    setToken(token) {
        if (!token) {
            throw new Error('Unexpected token value!');
        }

        this.#token = token;
        this.#tokenData = parseJwt(token);
    }

    setRefreshToken(token) {
        if (!token) {
            throw new Error('Unexpected refresh token value!');
        }

        this.#tokenRefresh = token;
    }
    setPendingRefresh(value){
        this.#tokenRefresh = value;
    }

    setRequestWithNotAuth(value){
        this.#tokenRefresh = value;
    }

    clearTokens() {
        this.#token = null;
        this.#tokenData = null;
        this.#tokenRefresh = null;
    }

    get token() {
        return this.#token;
    }
    get tokenRefresh() {
        return this.#tokenRefresh;
    }
    get tokenData() {
        return this.#tokenData;
    }
    get exp() {
        return this.#tokenData && parseInt(this.#tokenData?.exp, 10);
    }
    get userType() {
        return this.#tokenData && parseInt(this.#tokenData?.type_id, 10);
    }
    getPendingRefresh(){
        return this.#tokenRefresh;
    }

    getRequestWithNotAuth(){
        return this.#tokenRefresh;
    }
}

export default new TokenService();
