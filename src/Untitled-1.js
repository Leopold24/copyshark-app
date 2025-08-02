/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
@tailwind base;
@tailwind components;
@tailwind utilities;
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
import React, { useState } from 'react';

function SparkGenerator() {
  const [productDescription, setProductDescription] = useState('');
  const [idealCustomer, setIdealCustomer] = useState('');
  const [copyGoal, setCopyGoal] = useState('');
  const [tone, setTone] = useState('Witty');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSpark = async () => {
    const prompt = `Write a ${tone.toLowerCase()} short-form marketing copy for the following product: "${productDescription}". 
Target customer: ${idealCustomer}. 
Goal: ${copyGoal}. 
Limit it to one tweet or IG caption.`;

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResults(data.choices);
    } catch (err) {
      console.error('Error generating spark:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">✨ Generate Your Marketing Spark</h2>

      <div className="space-y-3">
        <input type="text" placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="text" placeholder="Ideal Customer" value={idealCustomer} onChange={(e) => setIdealCustomer(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="text" placeholder="Copy Goal" value={copyGoal} onChange={(e) => setCopyGoal(e.target.value)} className="w-full px-3 py-2 border rounded" />

        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-3 py-2 border rounded">
          <option value="Witty">Witty</option>
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>
          <option value="Inspiring">Inspiring</option>
          <option value="Bold">Bold</option>
        </select>

        <button onClick={handleGenerateSpark} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Generating...' : '🚀 Generate Spark'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
          {results.map((text, idx) => (
            <div key={idx} className="p-4 border rounded bg-white shadow-sm flex justify-between items-start">
              <p className="flex-1">{text}</p>
              <button onClick={() => navigator.clipboard.writeText(text)} className="ml-4 text-sm text-blue-500 hover:underline">
                Copy
              </button>
            </div>
          ))}

          <button onClick={handleGenerateSpark} className="text-sm mt-4 text-gray-600 hover:underline">
            🔁 Regenerate
          </button>
        </div>
      )}
    </div>
  );
}

export default SparkGenerator;
import Head from 'next/head'
import SparkGenerator from '@/components/SparkGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>Spark Generator</title>
      </Head>
      <main className="min-h-screen bg-white p-6">
        <SparkGenerator />
      </main>
    </>
  )
}
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      n: 3,
    });

    const outputs = completion.choices.map((c) => c.message.content);

    // Optional: Log to Firestore
    await addDoc(collection(db, 'spark_logs'), {
      prompt,
      outputs,
      createdAt: serverTimestamp(),
    });

    res.status(200).json({ choices: outputs });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error generating output' });
  }
}
