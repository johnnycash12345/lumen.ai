import { motion } from 'motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would send the data to a backend
    alert('Mensagem enviada! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[#0B1E3D] mb-4 text-center">Contato & Colaboração</h1>
          <p className="text-center text-[#0B1E3D]/70 mb-12 max-w-2xl mx-auto">
            O Lumen evolui com você. Entre em contato para parcerias, sugestões ou contribuições.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-lg border border-[#0B1E3D]/10 p-8"
            >
              <h3 className="text-[#0B1E3D] mb-6">Envie uma mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#0B1E3D] mb-2">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="border-[#0B1E3D]/20 focus-visible:ring-[#FFD479]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0B1E3D] mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="border-[#0B1E3D]/20 focus-visible:ring-[#FFD479]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0B1E3D] mb-2">Mensagem</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Sua mensagem..."
                    className="border-[#0B1E3D]/20 focus-visible:ring-[#FFD479] min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0B1E3D] hover:bg-[#FFD479] hover:text-[#0B1E3D] transition-colors duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg border border-[#0B1E3D]/10 p-8">
                <h3 className="text-[#0B1E3D] mb-6">Conecte-se</h3>
                
                <div className="space-y-4">
                  <a
                    href="mailto:contato@lumen.ai"
                    className="flex items-center gap-3 text-[#0B1E3D]/70 hover:text-[#FFD479] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFD479]/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#FFD479]" />
                    </div>
                    <div>
                      <div className="text-sm">Email</div>
                      <div className="text-xs">contato@lumen.ai</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 text-[#0B1E3D]/70 hover:text-[#FFD479] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFD479]/20 flex items-center justify-center">
                      <Github className="w-5 h-5 text-[#FFD479]" />
                    </div>
                    <div>
                      <div className="text-sm">GitHub</div>
                      <div className="text-xs">github.com/lumen-ai</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 text-[#0B1E3D]/70 hover:text-[#FFD479] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFD479]/20 flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-[#FFD479]" />
                    </div>
                    <div>
                      <div className="text-sm">LinkedIn</div>
                      <div className="text-xs">linkedin.com/company/lumen</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0B1E3D] to-[#0B1E3D]/80 rounded-lg p-8 text-white">
                <h4 className="mb-3 text-white">Contribua</h4>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  O Lumen é um projeto open-source. Contribua com código, 
                  sugira novos universos ou ajude a expandir a base de conhecimento.
                </p>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-[#0B1E3D]"
                >
                  Ver Guia de Contribuição
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 text-center text-sm text-[#0B1E3D]/50"
          >
            <p>Desenvolvido por Paulo Henrique • Manus AI • 2025</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
