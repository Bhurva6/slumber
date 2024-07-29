'use server'

import { ChatOpenAI } from '@langchain/openai'

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,

})

export async function generateStory(prompt: string) {
  prompt = `Generate a story for ${prompt}. The output should be in JSON array`
  const response = chatModel.invoke(prompt)
  console.log(response)
}