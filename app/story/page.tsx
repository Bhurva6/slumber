"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../styles/Story.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const StoryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam));
    }
  }, [searchParams]);

  const handleNewPrompt = () => {
    if (isEditing) {
      if (newPrompt.trim() !== '') {
        setPrompt(newPrompt);
        setIsEditing(false);
        router.push(`/story?prompt=${encodeURIComponent(newPrompt)}`);
      } else {
        alert('Please enter a prompt');
      }
    } else {
      setIsEditing(true);
      setNewPrompt(prompt);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundContainer}></div>
      <Link href="/" className={styles.backArrow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      <h1 className={styles.title}>Your Story</h1>
      <div className={styles.topContainer}>
        {isEditing ? (
          <input
            type="text"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            className={styles.promptInput}
          />
        ) : (
          <p>{prompt}</p>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleNewPrompt}>
          {isEditing ? "Generate Story✨" : "New Prompt ✨"}
        </button>
        <button className={styles.button}>Regenerate Story🔃</button>
      </div>
      <div className={styles.centerContainer}>
        <p>We are working to get you the best stories 🔨</p>
      </div>
    </div>
  );
}

const Story = dynamic(() => Promise.resolve(StoryContent), { ssr: false });

export default Story;