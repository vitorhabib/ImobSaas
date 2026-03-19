'use client';

import { 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function BillingSettings({ params }: { params: { slug: string } }) {
  const features = [
    'Imóveis ilimitados',
    'Relatórios avançados',
    'Até 10 usuários',
    'Suporte prioritário',
    'Integração WhatsApp',
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assinatura</h1>
          <p className="text-muted-foreground font-medium">Gerencie seu plano, faturas e métodos de pagamento.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg transition-all active:scale-95">
          <ArrowUpRight size={18} />
          Mudar de Plano
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-card p-8 rounded-2xl border-2 border-primary/20 shadow-sm transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Plano Atual</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary p-4 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground leading-tight">Plano Professional</h2>
              <p className="text-muted-foreground font-medium">Ideal para imobiliárias em crescimento.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-muted rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Próximo Vencimento</p>
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Calendar size={16} className="text-primary" />
                15 de Outubro, 2024
              </div>
            </div>
            <div className="p-4 bg-muted rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Valor Mensal</p>
              <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                <span className="text-sm font-normal text-muted-foreground">R$</span> 199,00
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground mb-4">Recursos Incluídos:</h3>
            <div className="grid grid-cols-2 gap-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm transition-colors flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-muted p-3 rounded-xl text-muted-foreground">
              <CreditCard size={24} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Pagamento</h2>
          </div>

          <div className="flex-1 space-y-6">
            <div className="p-4 border-2 border-border rounded-xl bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center text-[8px] text-background font-bold italic">VISA</div>
                  <span className="text-sm font-bold text-foreground">**** 4242</span>
                </div>
                <button className="text-xs font-bold text-primary hover:underline transition-all">Editar</button>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Expira em 12/2026</p>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95">
                Atualizar Método
              </button>
              <button className="w-full py-3 bg-muted border border-border text-foreground font-bold rounded-xl hover:bg-accent transition-all">
                Histórico de Faturas
              </button>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed">
            Suas cobranças são processadas com segurança através do Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
