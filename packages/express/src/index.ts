import { SyncProcess } from "@cloud-obs/core";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

const cloudObsRequestId = Symbol("cloud-obs-req-id");

type CloudObsRequest = Request & {
  [cloudObsRequestId]: {
    requestId: string
  }
}

const BATCH_TIMEFRAME = 1000;

export type CloudObsOptions = {
  apiKey?: string;
  version?: string;
}

/**
 * Function used in express server for communications with CloudObs
 * @param config 
 * @returns 
 */
export function cloudObs({ apiKey, version }: CloudObsOptions) {
  const syncProcess = new SyncProcess({
    apiKey: apiKey??process.env.CLOUD_OBS_API_KEY?? '',
    timeout: BATCH_TIMEFRAME
  });
    return (req: Request, res: Response, next: NextFunction) => {
      // TODO: Check the structure of header
      const requestId = req.headers['x-request-id'] as string??randomUUID();
      (req as CloudObsRequest)[cloudObsRequestId] = {
        requestId
      };
      const {send} = res;
      const startTime = new Date().toISOString();
      const start = performance.now();
      res.send = (data: any) => {
      const duration = performance.now() - start;
      syncProcess.addReq({
        id: requestId,
        url: req.originalUrl,
        method: req.method,
        startTime,
        endTime: new Date().toISOString(),
        duration,
        version
      });
      return send.bind(res)(data);
    };
    next();
  };
}
