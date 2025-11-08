import { motion } from 'motion';
import { Book, MessageCircle, GitBranch } from 'lucide-react';

interface MobileUniverseTabsProps {
  activeTab: 'catalog' | 'chat' | 'references';
  onTabChange: (tab: 'catalog' | 'chat' | 'references') => void;
}

export function MobileUniverseTabs({ activeTab, onTabChange }: MobileUniverseTabsProps) {
  const tabs = [
    { id: 'catalog' as const, label: 'Catálogo', icon: Book },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'references' as const, label: 'Referências', icon: GitBranch },
  ];

  return (
    <div className="bg-white border-b border-[#0B1E3D]/10 sticky top-[57px] sm:top-[65px] z-30">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-300 relative ${
                isActive
                  ? 'text-[#0B1E3D]'
                  : 'text-[#0B1E3D]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD479]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
