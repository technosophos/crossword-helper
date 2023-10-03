import { Llm, InferencingModels, HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"

const model = InferencingModels.Llama2Chat
// Prompt guide: https://huggingface.co/blog/llama2#how-to-prompt-llama-2
const user_message = "What countries are in the EU?"
const prompt = `
<s>[INST] <<SYS>>
Your are a bot that helps solve crossword puzzle clues.
Respond with one or more suggested. A suggested answer should be less than 20 characters.

What is the letter before omega?
kappa

Who were the three stooges?
Larry
Moe
Curley
Shep

What are synonyms for walk?
Stroll
Meander
Saunter
<</SYS>>

${user_message} [/INST]
`

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  let res = Llm.infer(model, prompt)
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(res)
  }
}
