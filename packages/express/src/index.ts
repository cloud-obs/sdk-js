import { Communicator } from "@cloud-obs/core";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";

const cloudObsRequestId = Symbol("cloud-obs-req-id");

type CloudObsRequest = Request & {
  [cloudObsRequestId]: {
    requestId: string
  }
}

const BATCH_TIMEFRAME = 1000;

/**
 * Function used in express server for communications with CloudObs
 * @param config 
 * @returns 
 */
export function cloudObs(apiKey: string) {
  const communicator = new Communicator({apiKey, timeout: BATCH_TIMEFRAME});
    return (req: Request, res: Response, next: NextFunction) => {
      // TODO: Check the structure of header
      const requestId = req.headers['x-request-id'] as string??uuidv4();
      (req as CloudObsRequest)[cloudObsRequestId] = {
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
