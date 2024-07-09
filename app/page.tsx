'use client';

import Head from 'next/head';
import styles from './styles/Home.module.css';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

const MODEL_NAME = "gemin-1.0-pro";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

async function runChat(prompt: string) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "HELLO" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello there! How can I assist you today?" }],
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());
}
const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const prompt = (event.target as HTMLFormElement)?.prompt?.value || "";
  runChat(prompt);
};


const sentences = [
  "I'd love to hear a story about fairies",
  "Tell me a story about a brave knight and a dragon",
  "Can you tell me a story about rockets?",
  "Tell me a story about Tom Sawyer",
  "I want to hear another story about cinderella and pirates"
];

const Home: FC = () => {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState('');
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentChar < sentences[currentSentence].length) {
        setPlaceholder(placeholder + sentences[currentSentence][currentChar]);
        setCurrentChar(currentChar + 1);
      } else {
        setTimeout(() => {
          setPlaceholder('');
          setCurrentChar(0);
          setCurrentSentence((currentSentence + 1) % sentences.length);
        }, 2000); // Wait for 2 seconds before starting the next sentence
      }
    }, 100); // Typing speed

    return () => clearTimeout(timeoutId);
  }, [placeholder, currentChar, currentSentence]);

  const genStory = () => {
    const encodedText = encodeURIComponent(inputText || placeholder);
    router.push(`/story?prompt=${encodedText}`);
  };
  const newStory = () => {
    router.push('/newStory');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}></div>
      <Head>
        <title>Slumber</title>
        <meta name="description" content="Generate bedtime stories for kids with ease!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Slumber</h1>
        <p className={styles.description}>What would you like to listen to today?</p>
        <div className={styles.inputContainer}>
          <input 
            type="text" 
            placeholder={placeholder} 
            className={styles.input} 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className={`${styles.button} ${styles.anotherButton}`} onClick={genStory}>
            Generate story✨
          </button>
        </div>
        <button className={`${styles.button} ${styles.surpriseButton}`} onClick={newStory}>
          Can't decide? Surprise me!🪄
        </button>
      </main>
      <footer className={styles.footer}>
        <a href='https://buildspace.so/'>made @ buildspace for n&w s5 🔨</a>
      </footer>
    </div>
  );
}

export default Home;
