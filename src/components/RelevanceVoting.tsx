import { useState } from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RelevanceVotingProps {
  contentId: string;
  initialVotes?: { up: number; down: number };
  onVote?: (contentId: string, vote: 'up' | 'down') => void;
}

export function RelevanceVoting({ contentId, initialVotes = { up: 0, down: 0 }, onVote }: RelevanceVotingProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [votes, setVotes] = useState(initialVotes);

  const handleVote = (vote: 'up' | 'down') => {
    if (userVote === vote) {
      // Remove vote
      setUserVote(null);
      setVotes(prev => ({
        ...prev,
        [vote]: Math.max(0, prev[vote] - 1)
      }));
    } else {
      // Add new vote or change vote
      if (userVote) {
        setVotes(prev => ({
          up: vote === 'up' ? prev.up + 1 : Math.max(0, prev.up - 1),
          down: vote === 'down' ? prev.down + 1 : Math.max(0, prev.down - 1)
        }));
      } else {
        setVotes(prev => ({
          ...prev,
          [vote]: prev[vote] + 1
        }));
      }
      setUserVote(vote);
      onVote?.(contentId, vote);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleVote('up')}
          className={`group p-1.5 rounded-lg transition-all duration-300 ${
            userVote === 'up'
              ? 'bg-[#FFD479] text-white'
              : 'bg-transparent text-[#0B1E3D]/40 hover:bg-[#FFD479]/10 hover:text-[#FFD479]'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </motion.button>
        {votes.up > 0 && (
          <span className={`text-xs ${userVote === 'up' ? 'text-[#FFD479]' : 'text-[#0B1E3D]/60'}`}>
            {votes.up}
          </span>
        )}
      </div>

      <div className="w-px h-4 bg-[#0B1E3D]/10" />

      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleVote('down')}
          className={`group p-1.5 rounded-lg transition-all duration-300 ${
            userVote === 'down'
              ? 'bg-red-400 text-white'
              : 'bg-transparent text-[#0B1E3D]/40 hover:bg-red-50 hover:text-red-400'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </motion.button>
        {votes.down > 0 && (
          <span className={`text-xs ${userVote === 'down' ? 'text-red-400' : 'text-[#0B1E3D]/60'}`}>
            {votes.down}
          </span>
        )}
      </div>
    </div>
  );
}
