const axios = require('axios')

export const authDomain = 'http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:8080/analytic-taxonomy-0.0.1-SNAPSHOT'

export function hasCredentials (localStorage) {
  return JSON.parse(localStorage.getItem('userDetails')) !== null
}

export function validateToken (token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      resolve(null)
    }

    // TODO: replace with 'fetch'
    axios.post(authDomain + '/validateToken', {'token': 'bearer ' + token})
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
