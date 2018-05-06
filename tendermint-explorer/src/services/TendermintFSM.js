import { logout } from './AuthService'
import * as QueryType from './TendermintQueryType'

export function changeState (queryResult, currentState) {
    const { type, status, response } = queryResult

    switch (status) {
        case 200: return status200(type, response, currentState)
        case 401: logout(); return
        case 404: return status404()
        case 503: return status503(response)
        default: return (response ? { warning: response } : { warning: "Tendermint have responed with an empty message" })
    }
}

function status200 (type, response, currentState) {
    let newState

    switch (type) {
        case QueryType.checkHealth: newState = okCheckHealth(response); break
        case QueryType.initChain: newState = okInitChain(response); break
        case QueryType.getSeed: newState = okGetSeed(response); break
        case QueryType.getData: newState = okGetData(response); break
        default: newState = okOther(response)
    }

    return { ...currentState, ...newState }
}

function status404 () {
    return {
        online: false,
        chainInited: false,
        error: "Not internet connection or server unavailable",
        warning: undefined
    }
}

function status503 (response) {
    return {
        online: false,
        chainInited: false,
        error: response,
        warning: undefined
    }
}

function okCheckHealth (response) {
    return {
        online: true,
        chainInited: response.chain_initilized,
        chainHeight: response.size,
        error: undefined,
        warning: undefined
    }
}

function okInitChain (response) {
    return (response && response["hash"] ? { chainInited: true } : {})
}

function okGetSeed (response) {
    return {
        seed: response.value,
        error: undefined,
        warning: undefined
    }
}

function okGetData (response) {
    return {
        blocks: response,
        error: undefined,
        warning: undefined
    }
}

function okOther (response) {
    return {
        online: true,
        error: undefined,
        warning: undefined
    }
}