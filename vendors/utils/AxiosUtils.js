import axios from 'axios'

export default {
  get: async function (url) {
    let result = await axios.get(url)
    return result.data
  }
}