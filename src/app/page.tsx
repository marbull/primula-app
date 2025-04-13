'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/hello');
        const data = await res.json();
        setMessage(data.message);
      } catch (error) {
        console.error('API fetch error:', error);
        setMessage('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-4">🌸 Primula App 🌸</h1>
      <p className="text-xl">{message}</p>
    </main>
  );
}
