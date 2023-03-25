import { Req } from "./types";

export interface Config {
    apiKey: string;
    timeout: number;
}
export declare class Communicator {
    constructor(config: Config);
    addReq(req: Req): void;
}
