import { Kv, Llm, InferencingModels, HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
const decoder = new TextDecoder()
const model = InferencingModels.Llama2Chat
const sysprompt = `
<<SYS>>
  Your are an assistant who helps solve crossword puzzle clues.
  Respond with one or more suggestions.
  A suggested answer should be less than 20 characters.
<</SYS>>
`

/**
 * Format a question to ask the LLM.
 * 
 * Prompt guide: https://huggingface.co/blog/llama2#how-to-prompt-llama-2
 * @param question The question from the user
 * @returns The full prompt
 */
function ask(question: string): string {
  return `
  <s>[INST] 
  ${sysprompt}
  ${question} [/INST]
  `
}

function reconstruct(instances: Inst[]): string {
  var prompt = `<s>[INST]${sysprompt}[/INST]`
  for (let i = 0; i < instances.length; i++) {
    let inst = instances[i];
    prompt += `[INST]${inst.question}[/INST]${inst.answer}`
  }
  return prompt
}

/*
QUESTION 1: <SYS>FIRST
STORE FIRST KV
QUESTION 2: INST SYS FIRST /INST ANSWER INST SECOND
*/


export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  // Get the data posted from the web browser
  let question = decoder.decode(request.body);

  // ULID would be a good key
  let session = "session" // Share a session key with the HTML page
  let store = Kv.openDefault()
  var prompt = ""
  if (store.exists(session)) {

    let chat = store.getJson(session)
    chat.push({
      question: question,
      answer: ""
    })

    prompt = reconstruct(chat)
  } else {
    prompt = ask(question)
    store.setJson(session, [{ question: sysprompt, answer: "" }])
  }

  // Ask the LLM a question
  let res = Llm.infer(model, prompt, { maxTokens: 250 })

  // Store question and the answer
  let myinst: Inst = {
    question: question,
    answer: res.text
  }

  // Store the latest version of our chat before returning
  let current = store.getJson(session)
  current.push(myinst)
  store.setJson(session, current)

  // Send the entire response back to the user
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(res)
  }
}

// [INST]
class Inst {
  question: string = ""
  answer: string = ""
}
