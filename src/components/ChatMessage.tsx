import { motion } from '@/lib/motion';
import { Sparkles, User } from 'lucide-react';
import { TypingEffect } from './TypingEffect';
import { RelevanceVoting } from './RelevanceVoting';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; reference: string }>;
  useTypingEffect?: boolean;
  showVoting?: boolean;
  messageId?: string;
}

export function ChatMessage({ 
  role, 
  content, 
  sources, 
  useTypingEffect = false,
  showVoting = false,
  messageId 
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-2 sm:gap-3 mb-4 sm:mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {role === 'assistant' && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FFD479]/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD479]" />
        </div>
      )}
      
      <div className={`max-w-[85%] sm:max-w-[80%] ${role === 'user' ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg sm:rounded-xl p-3 sm:p-4 ${
            role === 'user'
              ? 'bg-[#0B1E3D] text-white'
              : 'bg-white border border-[#0B1E3D]/10'
          }`}
        >
          {useTypingEffect && role === 'assistant' ? (
            <TypingEffect text={content} className="text-xs sm:text-sm leading-relaxed" />
          ) : (
            <p className="text-xs sm:text-sm leading-relaxed">{content}</p>
          )}
          
          {sources && sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#FFD479]/20">
              <div className="text-[10px] sm:text-xs text-[#FFD479]">Fontes canônicas:</div>
              <div className="mt-2 space-y-1">
                {sources.map((source, idx) => (
                  <button
                    key={idx}
                    className="block text-[10px] sm:text-xs text-[#0B1E3D]/70 hover:text-[#FFD479] transition-colors duration-200"
                  >
                    → {source.title} ({source.reference})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voting - only for assistant messages */}
        {role === 'assistant' && showVoting && messageId && (
          <div className="mt-2 flex justify-end">
            <RelevanceVoting contentId={messageId} />
          </div>
        )}
      </div>
      
      {role === 'user' && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0B1E3D] flex items-center justify-center flex-shrink-0">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}
