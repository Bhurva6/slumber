'use client';

import Head from 'next/head';
import styles from './styles/Home.module.css';
import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { generateStory } from './actions';

const sentences = [
  `I'd love to hear a story about fairies`,
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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    audioRef.current = new Audio('/bgm.mp3');
    if (audioRef.current) {
      audioRef.current.loop = true;
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.log("Audio play failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

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

async function onSubmit() {
  setIsLoading(true)
  await generateStory(prompt)
  setIsLoading(false)
}


  const genStory = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const newStory = () => {
    router.push('/newStory');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}></div>
      <Head>
        <title>Slumber</title>
        <meta name="description" content="Sleep better" />
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
          <button 
            className={`${styles.button} ${styles.anotherButton}`} 
            onClick={() => onSubmit()}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate story✨'}
          </button>
        </div>
        <button className={`${styles.button} ${styles.surpriseButton}`} onClick={newStory}>
          Can&apos;t decide? Surprise me!🪄
        </button>
        {generatedStory && (
          <div className={styles.storyContainer}>
            <h2>Generated Story:</h2>
            <p>{generatedStory}</p>
          </div>
        )}
      </main>
      <button onClick={toggleAudio} className={styles.audioControl}>
        {isPlaying ? "🔈" : "🔇"}
      </button>
      <footer className={styles.footer}>
        <a href='https://buildspace.so/'>made @ buildspace for n&w s5 🔨</a>
      </footer>
    </div>
  );
}

export default Home;