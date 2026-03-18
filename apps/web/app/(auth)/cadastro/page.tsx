import Link from 'next/link';

export default function Cadastro() {
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600 tracking-tighter inline-block mb-2">
            Imob SaaS
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Crie sua conta</h1>
          <p className="text-slate-500 mt-2">Comece a gerenciar sua imobiliária em minutos</p>
        </div>

        {/* Progress Bar Mock */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 px-1">
            <span className="text-blue-600">Tipo de Conta</span>
            <span>Organização</span>
            <span>Responsável</span>
            <span>Plano</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 w-1/4 h-full rounded-full"></div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Você é Pessoa Física ou Jurídica?</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 p-4 text-center">
                <input type="radio" name="personType" value="PF" className="sr-only" defaultChecked />
                <span className="text-xl">👤</span>
                <span className="font-semibold text-blue-900">Pessoa Física</span>
              </label>
              
              <label className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 p-4 text-center transition-colors">
                <input type="radio" name="personType" value="PJ" className="sr-only" />
                <span className="text-xl">🏢</span>
                <span className="font-semibold text-slate-700">Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          <button 
            type="button" 
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors mt-6"
          >
            Continuar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
