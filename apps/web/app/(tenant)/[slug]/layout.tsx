'use client';

import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Link as LinkIcon,
  CreditCard,
  Briefcase,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TenantLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: { slug: string };
}) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [orgData, setOrgData] = useState({ name: '', ownerName: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sincroniza o estado do submenu de configurações com a rota atual
  useEffect(() => {
    if (pathname?.includes('/settings')) {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

  // Inicializa o tema do localStorage no carregamento
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Sincroniza a classe 'dark' no elemento HTML e salva a preferência
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDarkMode]);

  useEffect(() => {
    // Carrega os dados persistidos no cadastro/login
    const savedData = localStorage.getItem(`org_${params.slug}`);
    if (savedData) {
      try {
        setOrgData(JSON.parse(savedData));
      } catch (e) {
        console.error("Erro ao carregar dados da organização", e);
      }
    }
  }, [params.slug]);

  // Nome formatado (usa o nome real se existir, senão usa o slug)
  const displayOrgName = orgData.name || params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const displayOwnerName = orgData.ownerName || displayOrgName;

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: `/${params.slug}/dashboard` },
    { icon: Briefcase, label: 'Imóveis', href: '#' },
    { icon: Users, label: 'Clientes', href: '#' },
    { icon: FileText, label: 'Relatórios', href: '#' },
    { icon: DollarSign, label: 'Financeiro', href: '#' },
  ];

  const settingsSubItems = [
    { icon: UserPlus, label: 'Usuários', href: `/${params.slug}/settings/users` },
    { icon: LinkIcon, label: 'Integrações', href: `/${params.slug}/settings/integrations` },
    { icon: CreditCard, label: 'Assinatura', href: `/${params.slug}/settings/billing` },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Remove o cookie de token para deslogar no Middleware
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Remove o tema salvo (opcional, mas bom para resetar)
    localStorage.removeItem('theme');
    
    // Redireciona para a página de login
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col transition-colors">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tighter">
            Imob SaaS
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}

          {/* Settings with Submenu */}
          <div>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isSettingsOpen || (pathname?.includes('/settings') ?? false)
                  ? 'text-primary bg-accent/50' 
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings size={20} />
                Configurações
              </div>
              {isSettingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isSettingsOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-border space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {settingsSubItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <subItem.icon size={16} />
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 transition-colors">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por imóveis, clientes..." 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </button>

            <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground leading-tight">Imobiliária {displayOrgName}</p>
                <p className="text-xs text-muted-foreground">{displayOwnerName}</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                {displayOrgName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 transition-colors bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
