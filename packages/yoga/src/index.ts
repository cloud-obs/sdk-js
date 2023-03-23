import { Communicator, GraphQLRequest, Req } from '@cloud-obs/core';
import { Plugin, handleStreamOrSingleExecutionResult } from '@envelop/core';
import { useOnResolve } from '@envelop/on-resolve';

const cloudObsSymbol = Symbol('cloud-obs');

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


/**
 * Function used in Apollo GraphQL server for communications with CloudObs
 * @returns 
 */
export const useCloudObsEnvelop = (config): Plugin => {
  const communicator = new Communicator(config);
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
                    const requestId: string = (payload.args.contextValue as any)?.req?.headers['x-request-id']?? crypto.randomUUID();
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
                    }
                    communicator.addReq(requestObj);
                    return handleStreamOrSingleExecutionResult(payload, ({ result }) => {
                        result.extensions = result.extensions || {};
                        result.extensions.requestObj= requestObj;
                    });
                }
            }
        }
    }
}
