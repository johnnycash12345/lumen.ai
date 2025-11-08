import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Button } from './ui/button';

export function DocumentationPage() {
  const documents = [
    {
      id: 1,
      title: 'Documento Técnico 1 — Lógica e Fluxo',
      description: 'Arquitetura lógica do sistema Lumen e fluxo de validação canônica.',
      pages: 12
    },
    {
      id: 2,
      title: 'Documento Técnico 2 — Arquitetura Multiagente',
      description: 'Sistema de três IAs especializadas e protocolo de comunicação.',
      pages: 18
    },
    {
      id: 3,
      title: 'Documento Técnico 3 — Front-end',
      description: 'Guia de design, componentes e experiência do usuário.',
      pages: 15
    },
    {
      id: 4,
      title: 'Plano Consolidado MVP',
      description: 'Roadmap completo, fases de desenvolvimento e especificações técnicas.',
      pages: 24
    }
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[#0B1E3D] mb-4 text-center">Documentação Técnica</h1>
          <p className="text-center text-[#0B1E3D]/70 mb-12 max-w-2xl mx-auto">
            Acesse os documentos técnicos completos do projeto Lumen, incluindo arquitetura, 
            design e plano de desenvolvimento.
          </p>

          <div className="space-y-4">
            {documents.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg border border-[#0B1E3D]/10 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#FFD479]/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#FFD479]" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[#0B1E3D] mb-2">{doc.title}</h3>
                    <p className="text-sm text-[#0B1E3D]/70 mb-3">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#0B1E3D]/50">
                        {doc.pages} páginas
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#0B1E3D]/20 text-[#0B1E3D] hover:bg-[#FFD479] hover:border-[#FFD479] hover:text-[#0B1E3D]"
                      >
                        <Download className="w-3 h-3 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 bg-white rounded-lg border border-[#0B1E3D]/10 p-8"
          >
            <h4 className="text-[#0B1E3D] mb-3 text-center">Recursos Adicionais</h4>
            <p className="text-sm text-[#0B1E3D]/70 text-center mb-6">
              Explore mais recursos e contribua para o projeto Lumen
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-[#0B1E3D]/20 text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white"
              >
                Whitepaper Técnico
              </Button>
              <Button
                variant="outline"
                className="border-[#0B1E3D]/20 text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white"
              >
                GitHub Repository
              </Button>
              <Button
                variant="outline"
                className="border-[#0B1E3D]/20 text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white"
              >
                API Documentation
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
