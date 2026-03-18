export default function ResetSenha() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">Enviar Link</button>
        </form>
      </div>
    </div>
  );
}
