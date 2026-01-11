'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function MessageCounter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  // This creates a supabase client for the browser
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCount = async () => {
      const { count: totalCount, error } = await supabase
        .from('message_history') 
        .select('*', { count: 'exact', head: true });

      if (!error) {
        setCount(totalCount);
      }
    };

    // This listens for any new inserts into the message_history table 
    // and updates the count for all active users immediately.
    const channel = supabase
      .channel('realtime_count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message_history' },
        () => fetchCount()
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
        <span className="opacity-90">
          OVER <span className="text-blue-400 font-bold">{count?.toLocaleString() || '0'}</span> LOGISTICS MESSAGES GENERATED
        </span>
      </div>
    </div>
  );
}