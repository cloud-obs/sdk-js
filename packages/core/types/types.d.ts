export type Req = {
  id: string;
  url: string;
  method: string;
  headers?: string[];
  startTime: string;
  endTime?: string;
  duration: number;
  version?: string;
}

export type GraphQLRequest = Req & {
  resolvers: GraphQLResolver[];
}

export type RestRequest = Req & {
  breakPoints: BreakPoint[];
}

export type GraphQLResolver = {
  path: string;
  fieldName: string;
  parentType: string;
  returnType: string;
  startOffset: number;
  duration: number;
}

export type BreakPoint = {
  name: string;
  startOffset: number;
  duration: number;
}
