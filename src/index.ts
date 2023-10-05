import { Llm, InferencingModels, HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
const decoder = new TextDecoder()
const model = InferencingModels.Llama2Chat

/**
 * Format a question to ask the LLM.
 * 
 * Prompt guide: https://huggingface.co/blog/llama2#how-to-prompt-llama-2
 * @param question The question from the user
 * @returns The full prompt
 */
function ask(question: string): string {
  return `
  <s>[INST] <<SYS>>
  Your are a bot that helps solve crossword puzzle clues.
  Respond with one or more suggestions. A suggested answer should be less than 20 characters.

  <</SYS>>
  
  ${question} [/INST]
  `

  /*
  Here are three examples:

  Question: What is the letter before omega?
  Answer: kappa
  
  Question: Who were the three stooges?
  Answer:
  * Larry
  * Moe
  * Curley
  * Shep
  
  Question: What are synonyms for walk?
  Answer:
  * Stroll
  * Meander
  * Saunter
  */
}


export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  // Get the data posted from the web browser
  let question = decoder.decode(request.body);

  // Ask the LLM a question
  let res = Llm.infer(model, ask(question), { maxTokens: 250 })

  // Send the entire response back to the user
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(res)
  }
}
