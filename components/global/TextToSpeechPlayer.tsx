"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2, VolumeX, Plus, Minus } from 'lucide-react';

interface TextToSpeechPlayerProps {
  content: string;
}

export default function TextToSpeechPlayer({ content }: TextToSpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Joanna');
  const [tempo, setTempo] = useState(1.0); // 1.0 is normal speed
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!content) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/polly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          voiceId: selectedVoice,
          // Include tempo/speed in the request if your API supports it
          speed: tempo.toFixed(1)
        }),
      });

      const data = await response.json();
      const audioSrc = `data:audio/mp3;base64,${data.audio}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.playbackRate = tempo; // Adjust playback speed
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const increaseTempo = () => {
    setTempo(prev => Math.min(prev + 0.1, 2.0)); // Max 2x speed
    if (audioRef.current && isPlaying) {
      audioRef.current.playbackRate = Math.min(tempo + 0.1, 2.0);
    }
  };

  const decreaseTempo = () => {
    setTempo(prev => Math.max(prev - 0.1, 0.5)); // Min 0.5x speed
    if (audioRef.current && isPlaying) {
      audioRef.current.playbackRate = Math.max(tempo - 0.1, 0.5);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center md:gap-3 gap-1   rounded-lg">
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <Button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2 bg-card border"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="h-4 w-4" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Listen
          </>
        )}
      </Button>
      
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        disabled={isLoading || isPlaying}
        className="border rounded-md px-3 py-2 text-sm bg-card"
      >
        <option value="Joanna">Joanna (English, US)</option>
        <option value="Matthew">Matthew (English, US)</option>
        <option value="Amy">Amy (English, UK)</option>
        <option value="Brian">Brian (English, UK)</option>
      </select>

      {/* Tempo Controls */}
      <div className="flex items-center gap-2 bg-card rounded-md p-0.5">
        <Button
          onClick={decreaseTempo}
          disabled={isLoading || tempo <= 0.5}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm w-10 text-center">
          {tempo.toFixed(1)}x
        </span>
        
        <Button
          onClick={increaseTempo}
          disabled={isLoading || tempo >= 2.0}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}