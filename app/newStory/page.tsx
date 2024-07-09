"use client";
import React from 'react';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/NewStory.module.css';
import Head from 'next/head';

const topics = [
  "Fantasy 🦄", "Adventure 🧗", "Science Fiction 🧪", 
  "Mystery 🕵️", "Fairy Tale 🧙‍♂️", "Animal Stories 🐈",
  "Anything ✨"
];

const NewStory: FC = () => {
  const router = useRouter();

  const handleBoxClick = () => {
    router.push('/random');  
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.boxcontainer}>
        <Head>
          <title>Choose Your Theme</title>
          <meta name="description" content="Choose your theme for an adventure" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className={styles.title}>Choose Your Theme</h1>
        <h2 className={styles.subtitle}>Pick a genre to begin your adventure</h2>
        <div className={styles.gridContainer}>
          {topics.slice(0, 6).map((topic, index) => (
            <div key={index} className={styles.box} onClick={handleBoxClick}>
              {topic}
            </div>
          ))}
        </div>
        <div className={styles.additionalBox} onClick={handleBoxClick}>
          {topics[6]}
        </div>
      </div>
    </div>
  );
}

export default NewStory;
