import { Req } from "../types";

export async function submit(batch: Req[], apiKey: string){
  return await fetch(`sdk-api.cloud-obs.com`, {
    method: 'POST',
    headers: {
      "api-key": apiKey,
    },
    body: JSON.stringify({
      data: batch,
    })
  })
}
