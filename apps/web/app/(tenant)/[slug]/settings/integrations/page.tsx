'use client';

import { Plus, ExternalLink, MessageCircle, Zap, Layout } from 'lucide-react';

export default function IntegrationsSettings({ params: _params }: { params: { slug: string } }) {
  const integrations = [
    {
      id: 1,
      name: 'WhatsApp',
      description: 'Integração direta para envio de propostas e atendimento.',
      icon: MessageCircle,
      status: 'Ativo',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      id: 2,
      name: 'Zapier',
      description: 'Conecte sua imobiliária com mais de 5.000 aplicativos externos.',
      icon: Zap,
      status: 'Inativo',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      id: 3,
      name: 'Portais Imobiliários',
      description: 'Publique seus imóveis automaticamente nos maiores portais.',
      icon: Layout,
      status: 'Ativo',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground font-medium">
            Conecte sua imobiliária com ferramentas externas e automatize seus processos.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg transition-all active:scale-95">
          <Plus size={18} />
          Nova Integração
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-card p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${integration.color} p-3 rounded-lg`}>
                <integration.icon size={24} />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  integration.status === 'Ativo'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {integration.status}
              </span>
            </div>
            <h3 className="text-foreground font-bold mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
              {integration.name}
              <ExternalLink
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {integration.description}
            </p>
            <button
              className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                integration.status === 'Ativo'
                  ? 'bg-muted text-foreground hover:bg-accent'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {integration.status === 'Ativo' ? 'Configurar' : 'Ativar Agora'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
