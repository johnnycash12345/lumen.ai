import { motion, useScroll, useTransform } from 'motion';
import { Shield, Network, Package, BookOpen } from 'lucide-react';
import { useRef } from 'react';

export function AboutPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const features = [
    {
      icon: Shield,
      title: 'Fidelidade Canônica',
      description: 'Sistema de validação tripla garante que todas as informações sejam fiéis às fontes originais.'
    },
    {
      icon: Network,
      title: 'Arquitetura Multiagente',
      description: 'Três IAs especializadas trabalham em conjunto: exploração, validação e síntese narrativa.'
    },
    {
      icon: Package,
      title: 'Packs de Universo',
      description: 'Cada universo é cuidadosamente mapeado com personagens, locais, eventos e objetos canônicos.'
    },
    {
      icon: BookOpen,
      title: 'Experiência Literária',
      description: 'Interface inspirada em enciclopédias clássicas, combinada com tecnologia moderna de IA.'
    }
  ];

  return (
    <div ref={ref} className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y, opacity }}
        >
          <h1 className="text-[#0B1E3D] mb-6 text-center">O que é o Lumen?</h1>
          
          <div className="bg-white rounded-lg p-8 mb-12 border border-[#0B1E3D]/10">
            <p className="text-lg leading-relaxed text-[#0B1E3D]/80 mb-6">
              O Lumen é uma enciclopédia interativa que permite explorar universos literários e de ficção 
              de forma profunda e validada. Guiado por uma IA erudita, o sistema garante que cada informação 
              seja fiel às fontes originais.
            </p>
            
            <p className="text-lg leading-relaxed text-[#0B1E3D]/80 mb-6">
              Mais do que um chatbot, o Lumen é um portal para o conhecimento narrativo — 
              onde você pode conversar com universos inteiros, explorando conexões entre personagens, 
              locais e eventos de forma orgânica e natural.
            </p>
            
            <p className="text-lg leading-relaxed text-[#0B1E3D]/80">
              Construído com tecnologia de ponta e design editorial elegante, 
              o Lumen une a tradição das grandes enciclopédias com a fluidez da era digital.
            </p>
          </div>

          <h3 className="text-[#0B1E3D] mb-8 text-center">Tecnologia e Filosofia</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg p-6 border border-[#0B1E3D]/10"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFD479]/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#FFD479]" />
                </div>
                <h4 className="text-[#0B1E3D] mb-2">{feature.title}</h4>
                <p className="text-sm text-[#0B1E3D]/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-gradient-to-r from-[#0B1E3D] to-[#0B1E3D]/80 rounded-lg p-8 text-center text-white"
          >
            <h4 className="mb-3 text-white">Nossa Missão</h4>
            <p className="text-white/90 leading-relaxed">
              Democratizar o acesso ao conhecimento literário, preservando a integridade das obras 
              enquanto oferecemos novas formas de exploração e descoberta.
            </p>
          </motion.div>

          <div className="mt-12 text-center text-sm text-[#0B1E3D]/50">
            <p>Desenvolvido por Paulo Henrique • Manus AI • 2025</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
