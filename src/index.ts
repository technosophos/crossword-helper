import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"

const encoder = new TextEncoder()

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      "answer": "I don't know."
    })
  }
}
