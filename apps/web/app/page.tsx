import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 tracking-tighter">Imob SaaS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link 
                href="/cadastro" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            A gestão completa para a sua <span className="text-blue-600">imobiliária</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Administre imóveis, clientes, contratos e o financeiro da sua imobiliária em um único lugar. Feito para acelerar o seu crescimento.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/cadastro" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Começar Teste Grátis
            </Link>
            <Link 
              href="#features" 
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-sm"
            >
              Ver Recursos
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer minimalista */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Imob SaaS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
