import decode from 'jwt-decode';
import { createBrowserHistory } from 'history';
import auth0 from 'auth0-js';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = 'pD7oWe9EPcsmDqySYf6pnR79ZGs4TweZ';
const CLIENT_DOMAIN = 'troush.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'create:transactions';
const AUDIENCE = 'http://localhost:8080';
const history = createBrowserHistory()

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login(role) {
  let scope = SCOPE;
  if (role == "driver") {
    scope = 'create:transactions'
  } else {
    scope = 'view:transactions'
  }
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: scope
  });
}

export function logout() {
  clearIdToken();
  clearAccessToken();
  window.location.href = "/";
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

export function userHasScopes(scopes) {
    if (!isLoggedIn()) { return null ;}
    const token = decode(localStorage.getItem('access_token'));
    if (!token.scope) { return null; }
    const grantedScopes = token.scope.split(' ');
    console.log(grantedScopes);
    return scopes.every(scope => grantedScopes.includes(scope));
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
