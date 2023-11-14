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

  Someone may ask you a QUESTION or ask you to FILL IN THE BLANKS.

  Questions end in with question marks (?).
  Fill in the blanks are in all capital letters, and have at least one underscore (_).

  When you get a question, answer it as described in QUESTIONS below.
  When you get a fill in the blank, answer them as described in FILL IN THE BLANKS below.

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

  When asked to fill in the blanks, you will be given a word that has one or more underscore (_) characters.
  Treat each underscore character as a wildcard that can be replaced with a single letter.
  If two underscores appear in a row, replace each underscore with one letter, for a total of two letters.
  For letters that are not underscores, leave them as-is. Do not re-arrange the letters.
  For each underscore, replace the underscore with exactly one letter.
  After the replacements are made, the result should be a dictionary word.
  
  For example, for S_IN, you should respond:

  These are some completions for S_IN:
  * SPIN
  * SHIN
  * SKIN
  
  For example, for _H_, you should respond:

  These are some completions for _H_:
  * THE
  * SHY
  * SHE
  * THO
  
  For example, for Z__, you should respond:

  These are some completions for Z__:
  * ZOO
  

  <</SYS>>
  
  ${question} [/INST]
  </s>
  `
  /*

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
