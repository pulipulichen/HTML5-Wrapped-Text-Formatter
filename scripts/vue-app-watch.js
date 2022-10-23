var appWatch = {
  
}

// console.log(LOCAL_CONFIG)
Object.keys(LOCAL_CONFIG).forEach(key => {
  appWatch['db.localConfig.' + key] = function () {
    this.saveLocalConfig()
  }
})