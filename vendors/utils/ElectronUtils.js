ElectronUtils = {
  getCallbackID: function (callback) {
    return callback + (new Date()).getTime();
  }
}