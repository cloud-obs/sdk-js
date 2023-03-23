import { Communicator, Req } from "@cloud-obs/core";
import { Config } from "@cloud-obs/core/src/methods";
import { NextFunction, Request, Response } from "express";


const cloudObsRequestId = Symbol("cloud-obs-req-id");

/**
 * Function used in express server for communications with CloudObs
 * @param config 
 * @returns 
 */
export default function cloudObs(config: Config) {
  const communicator = new Communicator(config);
    return (req: Request, res: Response, next: NextFunction) => {
      // TODO: Check the structure of header
      const requestId = req.headers['x-request-id'] as string?crypto.randomUUID();
      req[cloudObsRequestId] = {
        requestId
      };
      const {send} = res;
      const startTime = new Date().toISOString();
      const start = performance.now();
      res.send = (data: any) => {
      const duration = performance.now() - start;
      communicator.addReq({
        id: requestId,
        url: req.originalUrl,
        method: req.method,
        startTime,
        endTime: new Date().toISOString(),
        duration
      });
      return send.bind(res)(data);
    };
    next();
  };
}
