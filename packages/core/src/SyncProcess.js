const { submit } = require("./utils");

const SDK_API_SERVER = process.env.SDK_API_SERVER?? 'https://sdk-api.cloud-obs.com';

class SyncProcess {
  batches = [];
  url = SDK_API_SERVER + '/batch';

  constructor(config) {
    this.config = config;
    if (this.config.apiKey && this.config.apiKey.length > 0) {
      this.sync();
    } else {
      console.debug('Cloud-Obs.SyncProcess works in debug mode.')
    }
  }

  addReq(req) {
    this.batches.push(req)
  }

  sync() {
    setTimeout(() => {
      if (this.batches.length > 0) {
        submit(this.url, this.batches, this.config.apiKey)
        this.batches = [];
      }
      this.sync();
    }, this.config.timeout)
  }
}

module.exports = { SyncProcess };
