import { GraphQLResolver } from "@cloud-obs/core";

interface CloudObsContext {
    requestId: string | null;
    url: string;
    method: string;
    headers: string[];
    startTime?: string
    endTime?: string | null
    duration?: number | null
    resolvers: GraphQLResolver[]
    hrtime: [number, number]
}