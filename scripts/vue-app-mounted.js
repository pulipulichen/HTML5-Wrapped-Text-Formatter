/* global postMessageAPI, GameMaster */

var appMount = async function () {
  // console.log(this.localConfig)
  this.loadLocalConfig()
  this.inited = true
}