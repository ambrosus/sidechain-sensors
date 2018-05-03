import axios from 'axios'
import _ from 'lodash'

import config from '../config'

// Public 

export async function initChain(seed, rules) {
  const params = { seed: seed, rules: rules }
  const res = await axios.post(config.API_BACKEND + "/initilize-chain", params)
  console.log("INIT CHAIN", res);
  
  if (JSON.parse(res.data).result.hash) {
    window.location.href = "/chain-started"
  }
}

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
                  _.filter(i.tags, (t) => t.key === "app.creator")
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