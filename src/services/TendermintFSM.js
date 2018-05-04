import { logout } from './AuthService'

export function changeState(status, response) {
    if (status === 200 && response) {
        return {
            online: true,
            tendermint: response,
            error: undefined,
            warning: undefined
        }
    } else if (status === 401) {
        logout('Authentication required.')
    } else if (status === 404) {
        return {
            online: false,
            tendermint: undefined,
            error: "Not internet connection or server unavailable",
            warning: undefined
        }
    } else if (status === 503) {
        return {
            online: false,
            tendermint: undefined,
            error: response,
            warning: undefined
        }
    } else {
        return (response ? { warning: response } : { warning: "Tendermint have responed with an empty message" })
    }
}