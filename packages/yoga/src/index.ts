import { SyncProcess, GraphQLRequest } from '@cloud-obs/core';
import { Plugin, handleStreamOrSingleExecutionResult } from '@envelop/core';
import { useOnResolve } from '@envelop/on-resolve';
import { randomUUID } from 'crypto';

interface CloudObsContext {
    requestId: string | null;
    url: string;
    method: string;
    headers: string[];
    startTime?: string
    endTime?: string | null
    duration?: number | null
    resolvers: any[]
    hrtime: [number, number]
}

const cloudObsSymbol = Symbol('cloud-obs');

const BATCH_TIMEFRAME = 1000;

const HR_TO_NS = 1e9;
const NS_TO_MS = 1e6;

const deltaToMs = (hrtime: [number, number]) => {
    const delta = process.hrtime(hrtime);
    const ns = delta[0] * HR_TO_NS + delta[1];
    return ns / NS_TO_MS;
};

const durationHrTimeToNanos = (hrtime: [number, number]) => {
    return hrtime[0] * HR_TO_NS + hrtime[1];
}

const diffHrTimeToMs = (hrtimeStart: [number, number], hrtimeEnd: [number, number]) => {
    return (durationHrTimeToNanos(hrtimeEnd) - durationHrTimeToNanos(hrtimeStart)) / NS_TO_MS
}

export type CloudObsEnvelopConfig = {
    apiKey?: string
    version?: string
}

/**
 * Function used in Apollo GraphQL server for syncing with CloudObs.
 */
export const useCloudObs = ({apiKey, version}: CloudObsEnvelopConfig): Plugin => {
  const syncProcess = new SyncProcess({
    apiKey: apiKey??process.env.CLOUD_OBS_API_KEY?? '',
    timeout: BATCH_TIMEFRAME
});
    return {
        onPluginInit({addPlugin}) {
            const onResolve = useOnResolve(({info, context}) => {
                const ctx = (context as {[cloudObsSymbol]: CloudObsContext})[cloudObsSymbol];
                if (!ctx) return;
                const startOffset = process.hrtime(ctx.hrtime);

                return () => {
                    const endOffset = process.hrtime(ctx.hrtime);
                    ctx.resolvers.push({
                        path: info.path,
                        fieldName: info.fieldName,
                        parentType: info.parentType,
                        returnType: info.returnType,
                        startOffset: durationHrTimeToNanos(startOffset) / NS_TO_MS,
                        duration: diffHrTimeToMs(startOffset, endOffset)
                    });
                };
            })
            addPlugin(onResolve);
        },
        onExecute(onExecuteContext) {
            const ctxVal = onExecuteContext.args.contextValue;
            const req = (ctxVal as any).req;
            const ctx: CloudObsContext = {
                url: req.url,
                method: req.method,
                requestId: null,
                hrtime: process.hrtime(),
                startTime: new Date().toISOString(),
                endTime: null,
                duration: null,
                resolvers: [],
                headers: []
            };

            if (req && req.rawHeaders) {
                ctx.headers = req.rawHeaders
            }

            onExecuteContext.extendContext({[cloudObsSymbol]: ctx});

            return {
                onExecuteDone(payload) {
                    const requestId: string = (payload.args.contextValue as any)?.req?.headers['x-request-id']?? randomUUID();
                    const requestObj: GraphQLRequest = {
                        id: requestId,
                        url: ctx.url,
                        method: ctx.method,
                        headers: ctx.headers,
                        startTime: new Date().toISOString(),
                        endTime: new Date().toISOString(),
                        duration: deltaToMs(ctx.hrtime),
                        resolvers: ctx.resolvers.map(resolver => ({
                            path: resolver.path,
                            fieldName: resolver.fieldName,
                            parentType: resolver.parentType.toJSON(),
                            returnType: resolver.returnType.toJSON(),
                            startOffset: resolver.startOffset,
                            duration: resolver.duration,
                        })),
                        version,
                    }
                    syncProcess.addReq(requestObj);
                }
            }
        }
    }
}
