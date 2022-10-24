/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, domtoimage */

var appMethods = {
  saveLocalConfig () {
    if (this.inited === false) {
      return false
    }
    
    let data = {}
    // let keys = Object.keys(this.db.localConfig)
    // console.log(keys)
    // keys.forEach(key => {
      
    //   data[key] = this['db.localConfig.' + key]
    // })
    // console.log(data, this.db.localConfig)
    // data = JSON.stringify(data)
    data = JSON.stringify(this.db.localConfig)
    localStorage.setItem(this.cacheKey, data)
    // console.log(data)
  },
  loadLocalConfig: function () {
    let projectFileListData = localStorage.getItem(this.cacheKey)
    if (!projectFileListData) {
      return false
    }
    
    try {
      projectFileListData = JSON.parse(projectFileListData) 
    }
    catch (e) {
      console.error(e)
      return false
    }
      
    for (let key in projectFileListData) {
      this.db.localConfig[key] = projectFileListData[key]
      // console.log(key, projectFileListData[key])
    }
    // console.log(this.db.localConfig)
    // this.db.localConfig.joinDash = true
  },
  ...appMethodsTest
}