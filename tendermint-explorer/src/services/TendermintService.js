import decode from 'jwt-decode'
import { createBrowserHistory } from 'history'
import auth0 from 'auth0-js'
import axios from 'axios'
import _ from 'lodash'

import config from '../config'

// Constants

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const CLIENT_ID = 'pD7oWe9EPcsmDqySYf6pnR79ZGs4TweZ'
const CLIENT_DOMAIN = 'troush.auth0.com'
const REDIRECT = 'http://localhost:3000/callback'
const AUDIENCE = 'http://localhost:8080'

const history = createBrowserHistory()
const auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
})

// Public 

export function loadChain() {
  axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('access_token');
    axios.get(config.API_BACKEND + "/seed")
      .then(function (res) {
        console.log(res);
        let data = JSON.parse(res.data)
        this.setState({seed:  data.value.slice(4, data.value.length)})
      }.bind(this))
    this.featchData();
}

export function getData(height) {
  return axios.get(config.API_BACKEND + `/blocks?height=${height}`)
  .then(function (res) {
    if (res.data.length > 5) {
      let data = JSON.parse(res.data)
      res = _.filter(data,
          (i) => i.tags ?
                  _.filter(i.tags, (t) => t.key == "app.creator")
                  : false)
          .map((i) => i.tags)
          .map(function(i) {
            return _.map(i, (v) => v.valueString)
          })
      this.state.blocks.push(res[0])
      this.setState({blocks: this.state.blocks})
    }
  }.bind(this))
}

export function featchData() {
  let height = 0;
  axios.get(config.API_BACKEND + "/health")
    .then(function (res) {
      return JSON.parse(res.data).result.response.last_block_height
    }.bind(this))
    .then(function (height) {
      for (var i = 1; i <= height; i++) {
        this.getData(i)
      }
      this.setState({loaded: true})
    }.bind(this))
}

export function initChain(seed, rules) {
  // axios.post(config.API_BACKEND + "/initilize-chain", data)
  // .then(res => {
  //   if (JSON.parse(res.data).result.hash) {
  //     window.location.href = "/chain-started"
  //   }
  // })
}

export function silentAuth() {
  // axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('access_token')
  // axios.get(config.API_BACKEND + "/health")
  //     .then(function (res) {
  //       let data = JSON.parse(res.data)

  //       this.setState({tendermint: {
  //         online: data.result ? true : false,
  //         data: data.result ? JSON.parse(data.result.response.data) : null
  //       }})

  //       if (JSON.parse(data.result.response.data).chain_initilized) {
  //         window.location.href = "/chain-started";
  //       }
  //     }.bind(this))
}

export function login(role) {
  const scope = (role == "driver" ? 'create:transactions' : 'view:transactions')
  const responseType = 'token id_token'
  const redirectUri = REDIRECT
  const audience = AUDIENCE

  auth.authorize({ responseType, redirectUri, audience, scope });
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
    if (!isLoggedIn()) { 
      return null 
    }

    const token = decode(localStorage.getItem('access_token'))

    if (!token.scope) { 
      return null
    }

    const grantedScopes = token.scope.split(' ')
    console.log("Granted authorization scopes", grantedScopes)

    return scopes.every(scope => grantedScopes.includes(scope))
}

// Private

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

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken)

  if (!token.exp) { 
    return null
  }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token)

  return expirationDate < new Date()
}
