import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600 tracking-tighter inline-block mb-2">
            Imob SaaS
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Bem-vindo de volta</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para continuar</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">Senha</label>
              <Link href="/reset-senha" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Esqueceu a senha?
              </Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">
            Ainda não tem uma conta?{' '}
            <Link href="/cadastro" className="text-blue-600 font-semibold hover:underline">
              Crie agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
