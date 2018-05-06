import axios from 'axios'
import _ from 'lodash'

import config from '../config'
import * as QueryType from './TendermintQueryType'
import { getAccessToken } from './AuthService'

// Public 

export async function checkHealth () {
  const type = QueryType.checkHealth

  try {
    if (!getAccessToken()) return { status: 401, response: "Unautorized" }

    axios.defaults.headers.common['Authorization'] = "Bearer " + getAccessToken()

    const res = await axios.get(config.API_BACKEND + "/check_health")
    const status = res.status
    const response = JSON.parse(JSON.parse(res.data).result.response.data)
    
    return { type, status, response }
  } catch (err) {
    if (!err.response || !err.status) return { type, status: 503, response: "Network error" }

    const status = err.response.status
    const response = err.response.statusText

    return { type, status, response }
  }
}

export async function initChain (seed, rules) {
  const type = QueryType.initChain

  try {
    const params = { seed: seed, rules: rules }
    const res = await axios.post(config.API_BACKEND + "/init_chain", params)
    const status = res.status
    const response = JSON.parse(res.data).result
    
    return { type, status, response }
  } catch (err) {
    if (!err.response || !err.status) return { type, status: 503, response: "Network error" }
    
    const status = err.response.status
    const response = err.response.statusText

    return { type, status, response }
  }
}

export async function getSeed () {
  const type = QueryType.getSeed

  try {
    const res = await axios.get(config.API_BACKEND + "/seed")
    const status = res.status
    const response = JSON.parse(res.data)
    
    return { type, status, response }
  } catch (err) {
    if (!err.response || !err.status) return { type, status: 503, response: "Network error" }

    const status = err.response.status
    const response = err.response.statusText

    return { type, status, response }
  }
}

export async function getData (chainHeight) {
  const type = QueryType.getData
  var response = []

  for (var blockNum = 3; blockNum <= chainHeight; blockNum += 2) {
    const blockResult = await getBlock(blockNum)
    response.push(blockResult.response)
  }

  const status = response.length > 0 ? 200 : 204

  return { type, status, response }
}

export async function getBlock (height) {
  const type = QueryType.getBlock
  
  try {
    const res = await axios.get(config.API_BACKEND + `/block?height=${height}`)
    
    switch (res.data) {
      case "": {
        const status = 204
        const response = undefined

        return { type, status, response }
      }

      default: {
        const status = res.status
        const data = JSON.parse(res.data)
        const tags = _.map(data, el => el.tags)
        const response = _.map(tags, tag => {
            console.log(tag);
            
            return _.map(tag, el => {
              console.log(el.value);
              return el.value
            })
          })[0]
        
        // const response = _.filter(data, i => i.tags ? _.filter(i.tags, t => t.key === "app.creator") : false)
        //   .map(i => i.tags)
        //   .map(i => {
        //     return _.map(i, (v) => v.valueString)
        //   })

        return { type, status, response }
      }
    }
  } catch (err) {
    if (!err.response || !err.status) return { type, status: 503, response: "Network error" }
    
    const status = err.response.status
    const response = err.response.statusText

    return { type, status, response }
  }
}