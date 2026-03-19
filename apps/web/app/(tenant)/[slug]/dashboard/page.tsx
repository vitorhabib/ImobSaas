'use client';

import { 
  Users, 
  Home, 
  Plus,
  TrendingUp,
  DollarSign,
  Bell
} from 'lucide-react';

export default function Dashboard({ params }: { params: { slug: string } }) {
  const stats = [
    { label: 'Total de Imóveis', value: '124', change: '+12%', icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/30', darkColor: 'dark:text-blue-400' },
    { label: 'Clientes Ativos', value: '1,240', change: '+5.4%', icon: Users, color: 'text-green-600', bg: 'bg-green-100', darkBg: 'dark:bg-green-900/30', darkColor: 'dark:text-green-400' },
    { label: 'Receita Mensal', value: 'R$ 45.200', change: '+8.2%', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/30', darkColor: 'dark:text-purple-400' },
    { label: 'Novas Propostas', value: '38', change: '+14%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100', darkBg: 'dark:bg-orange-900/30', darkColor: 'dark:text-orange-400' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-medium">Bem-vindo de volta! Aqui está o que está acontecendo hoje.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg transition-all active:scale-95">
          <Plus size={18} />
          Novo Imóvel
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.darkBg} ${stat.color} ${stat.darkColor} p-3 rounded-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts/Tables Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex items-center justify-center text-muted-foreground flex-col gap-2 transition-colors">
          <TrendingUp size={48} className="opacity-20" />
          <p className="font-bold text-foreground">Gráfico de Vendas e Locações</p>
          <p className="text-sm">Os dados serão exibidos assim que houver movimentação.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-80 flex items-center justify-center text-muted-foreground flex-col gap-2 transition-colors">
          <Bell size={48} className="opacity-20" />
          <p className="font-bold text-foreground">Atividades Recentes</p>
          <p className="text-sm text-center">Acompanhe as últimas ações da sua equipe aqui.</p>
        </div>
      </div>
    </>
  );
}
