import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Car, Lock, Mail, ArrowRight } from 'lucide-react'

export function Login() {
    const { signIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')
        const { error } = await signIn(email, password)
        if (error) setErrorMsg('Credenciais inválidas. Tente novamente.')
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col justify-center relative overflow-hidden px-6 pb-20">
            {/* Premium Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-sm mx-auto relative z-10 animate-slide-up">
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-float rotate-3 hover:rotate-6 transition-transform">
                            <Car className="w-10 h-10 text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-white tracking-tighter mb-2">No Brilho</h1>
                        <p className="text-brand-100 font-medium">Lava-Jato Premium</p>
                    </div>

                    {/* Glassmorphism Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-2xl flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest pl-1">E-mail</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email" required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400 font-sans"
                                        placeholder="admin@nobrilho.app"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest pl-1">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-brand-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 h-14 bg-dark-800/50 border border-white/5 rounded-2xl focus:bg-dark-800 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-all outline-none text-white font-medium placeholder:text-gray-600 tracking-widest"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 mt-4 bg-white text-dark-900 rounded-2xl font-black text-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex justify-between items-center px-6 group"
                            >
                                <span>{loading ? 'Autenticando...' : 'Acessar Painel'}</span>
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />}
                            </button>
                        </form>
                    </div>

                    <p className="text-xs font-medium text-white/50">
                        Sistema Exclusivo de Gestão No Brilho &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    )
}
