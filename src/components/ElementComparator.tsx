import { useState } from 'react';
import { motion, AnimatePresence } from 'motion';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Element {
  id: string;
  name: string;
  type: 'character' | 'location' | 'object';
  attributes: Record<string, string>;
  description: string;
}

interface ElementComparatorProps {
  element: Element;
  availableElements: Element[];
  onCompare?: (element1: Element, element2: Element) => void;
}

export function ElementComparator({ element, availableElements, onCompare }: ElementComparatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleCompare = () => {
    if (selectedElement) {
      onCompare?.(element, selectedElement);
    }
  };

  const compatibleElements = availableElements.filter(e => e.type === element.type && e.id !== element.id);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="border-[#FFD479] text-[#0B1E3D] hover:bg-[#FFD479]/10"
      >
        <Scale className="w-4 h-4 mr-2" />
        Comparar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0B1E3D]">
              <Scale className="w-5 h-5 text-[#FFD479]" />
              Comparador Canônico
            </DialogTitle>
          </DialogHeader>

          {!selectedElement ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#F8F4ED] to-white p-4 rounded-lg border border-[#FFD479]/30">
                <div className="text-xs text-[#FFD479] mb-1">Elemento Base</div>
                <div className="text-lg text-[#0B1E3D]">{element.name}</div>
                <div className="text-sm text-[#0B1E3D]/60 mt-1">{element.type}</div>
              </div>

              <div className="text-sm text-[#0B1E3D]/70 mb-2">
                Selecione um elemento para comparar:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {compatibleElements.map(el => (
                  <motion.button
                    key={el.id}
                    onClick={() => setSelectedElement(el)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left p-4 rounded-lg border border-[#0B1E3D]/10 hover:border-[#FFD479] hover:bg-[#FFD479]/5 transition-all duration-300"
                  >
                    <div className="text-sm text-[#0B1E3D] mb-1">{el.name}</div>
                    <div className="text-xs text-[#0B1E3D]/60 line-clamp-2">{el.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selection Header */}
              <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#F8F4ED] to-white p-4 rounded-lg border border-[#FFD479]/20">
                <div className="flex-1">
                  <div className="text-xs text-[#FFD479] mb-1">Base</div>
                  <div className="text-base text-[#0B1E3D]">{element.name}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#FFD479] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-[#FFD479] mb-1">Comparando com</div>
                  <div className="text-base text-[#0B1E3D]">{selectedElement.name}</div>
                </div>
                <Button
                  onClick={() => setSelectedElement(null)}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile: Tabs View */}
              <div className="lg:hidden">
                <Tabs defaultValue="element1" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="element1">{element.name}</TabsTrigger>
                    <TabsTrigger value="element2">{selectedElement.name}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="element1" className="space-y-3">
                    <ElementCard element={element} />
                  </TabsContent>
                  <TabsContent value="element2" className="space-y-3">
                    <ElementCard element={selectedElement} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Desktop: Side by Side */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                <ElementCard element={element} />
                <ElementCard element={selectedElement} />
              </div>

              <div className="pt-4 border-t border-[#0B1E3D]/10">
                <Button
                  onClick={handleCompare}
                  className="w-full bg-[#FFD479] hover:bg-[#0B1E3D] text-[#0B1E3D] hover:text-white transition-all duration-300"
                >
                  Analisar Diferenças e Semelhanças
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ElementCard({ element }: { element: Element }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-[#F8F4ED] p-4 rounded-lg border border-[#0B1E3D]/10 space-y-3"
    >
      <div>
        <div className="text-lg text-[#0B1E3D] mb-1">{element.name}</div>
        <div className="text-xs text-[#FFD479] uppercase tracking-wide">{element.type}</div>
      </div>

      <div className="text-sm text-[#0B1E3D]/70 leading-relaxed">
        {element.description}
      </div>

      <div className="space-y-2 pt-2 border-t border-[#0B1E3D]/10">
        {Object.entries(element.attributes).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-2 text-xs">
            <span className="text-[#0B1E3D]/60 capitalize">{key}:</span>
            <span className="text-[#0B1E3D] text-right">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
