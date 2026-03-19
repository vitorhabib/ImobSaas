'use client';

import { useState } from 'react';
import Link from 'next/link';

type PersonType = 'PF' | 'PJ';

interface FormData {
  personType: PersonType;
  name: string;
  slug: string;
  orgEmail: string;
  phone: string;
  cpf: string;
  cnpj: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPasswordConfirm: string;
}

const STEPS = ['Tipo de Conta', 'Organização', 'Responsável', 'Confirmar'];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Cadastro() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    personType: 'PF',
    name: '',
    slug: '',
    orgEmail: '',
    phone: '',
    cpf: '',
    cnpj: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPasswordConfirm: '',
  });

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const slugify = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const validateStep = (): string => {
    if (step === 1) {
      if (!form.name.trim()) return 'Informe o nome da organização';
      if (!form.slug.trim()) return 'Informe o slug';
      if (!/^[a-z0-9-]+$/.test(form.slug)) return 'Slug inválido: use apenas letras minúsculas, números e -';
      if (!form.orgEmail.trim()) return 'Informe o e-mail da organização';
      if (form.personType === 'PF' && !form.cpf.trim()) return 'Informe o CPF';
      if (form.personType === 'PJ' && !form.cnpj.trim()) return 'Informe o CNPJ';
    }
    if (step === 2) {
      if (!form.ownerName.trim()) return 'Informe seu nome';
      if (!form.ownerEmail.trim()) return 'Informe seu e-mail';
      if (!form.ownerPassword) return 'Informe a senha';
      if (form.ownerPassword.length < 6) return 'Senha deve ter ao menos 6 caracteres';
      if (form.ownerPassword !== form.ownerPasswordConfirm) return 'As senhas não coincidem';
    }
    return '';
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personType: form.personType === 'PF' ? 'INDIVIDUAL' : 'COMPANY',
          name: form.name,
          slug: form.slug,
          email: form.orgEmail,
          phone: form.phone || undefined,
          cpf: form.personType === 'PF' ? form.cpf : undefined,
          cnpj: form.personType === 'PJ' ? form.cnpj : undefined,
          ownerName: form.ownerName,
          ownerEmail: form.ownerEmail,
          ownerPassword: form.ownerPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar conta');

      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      window.location.href = `/${data.slug}/dashboard`;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-medium mb-2 px-1">
            {STEPS.map((s, i) => (
              <span key={s} className={i === step ? 'text-blue-600 font-semibold' : i < step ? 'text-green-600' : 'text-slate-400'}>
                {s}
              </span>
            ))}
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Step 0: Tipo de Conta */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Você é Pessoa Física ou Jurídica?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => set('personType', 'PF')}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-colors ${form.personType === 'PF' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <span className="text-2xl">👤</span>
                <span className={`font-semibold ${form.personType === 'PF' ? 'text-blue-900' : 'text-slate-700'}`}>Pessoa Física</span>
              </button>
              <button
                type="button"
                onClick={() => set('personType', 'PJ')}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-colors ${form.personType === 'PJ' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <span className="text-2xl">🏢</span>
                <span className={`font-semibold ${form.personType === 'PJ' ? 'text-blue-900' : 'text-slate-700'}`}>Pessoa Jurídica</span>
              </button>
            </div>
            <button onClick={next} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
              Continuar
            </button>
          </div>
        )}

        {/* Step 1: Organização */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Dados da sua imobiliária</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome da imobiliária *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value);
                  if (!form.slug) set('slug', slugify(e.target.value));
                  else set('slug', slugify(e.target.value));
                }}
                placeholder="Ex: Imobiliária Silva"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Slug (URL) *</label>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="px-3 py-3 bg-slate-50 text-slate-500 text-sm border-r border-slate-300">imobsaas.com/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  placeholder="minha-imobiliaria"
                  className="flex-1 px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail da empresa *</label>
              <input
                type="email"
                value={form.orgEmail}
                onChange={(e) => set('orgEmail', e.target.value)}
                placeholder="contato@imobiliaria.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {form.personType === 'PF' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF *</label>
                <input
                  type="text"
                  value={form.cpf}
                  onChange={(e) => set('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CNPJ *</label>
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => set('cnpj', e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(0)} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Voltar
              </button>
              <button onClick={next} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Responsável */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Dados do responsável</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Seu nome *</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => set('ownerName', e.target.value)}
                placeholder="João da Silva"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Seu e-mail *</label>
              <input
                type="email"
                value={form.ownerEmail}
                onChange={(e) => set('ownerEmail', e.target.value)}
                placeholder="joao@imobiliaria.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha *</label>
              <input
                type="password"
                value={form.ownerPassword}
                onChange={(e) => set('ownerPassword', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar senha *</label>
              <input
                type="password"
                value={form.ownerPasswordConfirm}
                onChange={(e) => set('ownerPasswordConfirm', e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Voltar
              </button>
              <button onClick={next} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmar */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Confirme seus dados</h2>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Tipo:</span><span className="font-medium">{form.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Imobiliária:</span><span className="font-medium">{form.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Slug:</span><span className="font-medium">{form.slug}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">E-mail:</span><span className="font-medium">{form.orgEmail}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Responsável:</span><span className="font-medium">{form.ownerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Plano:</span><span className="font-medium text-green-600">Trial gratuito</span></div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Voltar
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
