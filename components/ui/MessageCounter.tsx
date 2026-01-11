'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface MessageCounterProps {
  initialCount: number;
}

export default function MessageCounter({ initialCount }: MessageCounterProps) {
  const [count, setCount] = useState<number>(initialCount);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Real-time listener
    const channel = supabase
      .channel('realtime_count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message_history' },
        async () => {
          // Re-fetch the exact count when a change happens
          const { count: newCount } = await supabase
            .from('message_history')
            .select('*', { count: 'exact', head: true });
          
          if (newCount !== null) setCount(newCount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full bg-slate-900 text-white py-1.5 px-6 flex justify-center items-center">
      <div className="flex items-center gap-3 text-[11px] md:text-xs font-semibold tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="opacity-90 uppercase">
          OVER <span className="text-blue-400 font-bold">{count.toLocaleString()}</span> LOGISTICS MESSAGES GENERATED
        </span>
      </div>
    </div>
  );
}