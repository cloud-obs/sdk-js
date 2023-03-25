const { submit } = require("./submitter");

class Communicator {
  batches = [];

  constructor(config) {
    this.config = config;
    this.sync();
  }

  addReq(req) {
    this.batches.push(req)
  }

  sync() {
    setTimeout(() => {
      if (this.batches.length > 0) {
        submit(this.batches, this.config.apiKey)
        this.batches = [];
      }
      this.sync();
    }, this.config.timeout)
  }
}

module.exports = {Communicator};
