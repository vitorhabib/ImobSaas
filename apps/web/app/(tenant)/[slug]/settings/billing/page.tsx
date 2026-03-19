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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assinatura</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Gerencie seu plano, faturas e métodos de pagamento.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95">
          <ArrowUpRight size={18} />
          Mudar de Plano
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-blue-100 dark:border-blue-900 shadow-sm transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Plano Atual</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Plano Professional</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Ideal para imobiliárias em crescimento.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Próximo Vencimento</p>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Calendar size={16} className="text-blue-600" />
                15 de Outubro, 2024
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Valor Mensal</p>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <span className="text-sm font-normal text-slate-400">R$</span> 199,00
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recursos Incluídos:</h3>
            <div className="grid grid-cols-2 gap-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-400">
              <CreditCard size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pagamento</h2>
          </div>

          <div className="flex-1 space-y-6">
            <div className="p-4 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-slate-900 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">**** 4242</span>
                </div>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all">Editar</button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expira em 12/2026</p>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95">
                Atualizar Método
              </button>
              <button className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Histórico de Faturas
              </button>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 leading-relaxed">
            Suas cobranças são processadas com segurança através do Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
