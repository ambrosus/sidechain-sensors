import decode from 'jwt-decode'
import auth0 from 'auth0-js'
import axios from 'axios'

import history from '../history'

// Constants

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const CLIENT_ID = 'pD7oWe9EPcsmDqySYf6pnR79ZGs4TweZ'
const CLIENT_DOMAIN = 'troush.auth0.com'
const REDIRECT = 'http://localhost:3000/callback'
const AUDIENCE = 'http://localhost:8080'

const auth = new auth0.WebAuth({
    clientID: CLIENT_ID,
    domain: CLIENT_DOMAIN
})

// Public

export function userHasScopes(scopes) {
    if (!isLoggedIn()) return null

    const token = decode(localStorage.getItem('access_token'))

    if (!token.scope) return null

    const grantedScopes = token.scope.split(' ')

    return scopes.every(scope => grantedScopes.includes(scope))
}

export function getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY)
}

export function setIdToken() {
    const idToken = getParameterByName('id_token')
    localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken() {
    let accessToken = getParameterByName('access_token')
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

    axios.defaults.headers.common['Authorization'] = "Bearer " + getAccessToken()
}

export function isLoggedIn() {
    const idToken = getIdToken()
    console.log(!!idToken, !isTokenExpired(idToken));
    
    return !!idToken && !isTokenExpired(idToken)
}

export function login(role) {
    const scope = (role === "driver" ? 'create:transactions' : 'view:transactions')
    const responseType = 'token id_token'
    const redirectUri = REDIRECT
    const audience = AUDIENCE

    auth.authorize({ responseType, redirectUri, audience, scope })
}

export function logout() {
    localStorage.clear()

    delete axios.defaults.headers.common['Authorization']

    history.push('/')
}

// Private

function getParameterByName(name) {
    let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash)
    console.log("MATCH", name, decodeURIComponent(match[1].replace(/\+/g, ' ')));
    
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken)

    if (!token.exp) return null

    const date = new Date(0)
    date.setUTCSeconds(token.exp)

    return date
}

function isTokenExpired(token) {
    if (!token) return true

    const expirationDate = getTokenExpirationDate(token)

    return expirationDate < new Date()
}