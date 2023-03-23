import { Req } from "../types";
import { submit } from "./submitter";

export interface Config {
    apiKey: string;
    timeout: number;
}

export class Communicator {
    private batches: Req[] = [];

    constructor(private config: Config) {
    }

    public addReq(req: Req) {
      this.batches.push(req)
    }

    private sync() {
      setTimeout(() => {
        submit(this.batches, this.config.apiKey)
        this.batches = [];
        this.sync();
      }, this.config.timeout)
    }
}
