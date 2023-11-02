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
  Your are an assistant who helps solve crossword puzzle clues.
  Respond with one or more suggestions.
  A suggested answer should be less than 20 characters.

  Someone may ask you a QUESTION, give you a CLUE, or ask you to FILL IN THE BLANKS.

  QUESTIONS:

  For questions, provide one or more answers,  where each answer starts with an asterisk to act as a bullet.
  Each answer should be followed by a count of the number of letters in the suggested word (ignoring spaces).

  
  For example:

  What are some shades of red?

  * Maroon (6)
  * Crimson (7)
  * Scarlet (7)

  CLUES:

  For clues, treat them like questions. For example:

  Actors who played Batman

  * Adam West (8)
  * Christian Bale (13)
  * Michael Keaton (13)

  FILL IN THE BLANKS:

  When you are asked to fill in the blanks, you will be given a word that has one or more underscore (_) characters.
  Replace each underscore with a single letter in order to spell a word,
  but do not change the order of any of the letters. Each response you generate should be followed by the count of the number of 
  letters in the suggested word.

  For example, for S_IN, you should respond:
  * SPIN (4)
  * SHIN (4)
  * SKIN (4)
  
  For example, for _H_, you should respond:
  * THE (3)
  * SHY (3)
  * SHE (3)
  * THO (3)
  
  For z__, you should respond:
  * zoo (3)

  <</SYS>>
  
  ${question} [/INST]
  </s>
  `
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
