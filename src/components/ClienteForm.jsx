import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserPlus, Car, Phone } from 'lucide-react'

export function ClienteForm({ onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Cliente State
    const [nome, setNome] = useState('')
    const [whatsapp, setWhatsapp] = useState('')

    // Veiculo State
    const [placa, setPlaca] = useState('')
    const [modelo, setModelo] = useState('')
    const [cor, setCor] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        try {
            const phoneNum = whatsapp.replace(/\D/g, '')
            let clienteId = null

            const { data: existingCliente } = await supabase
                .from('clientes')
                .select('id')
                .eq('whatsapp', phoneNum)
                .single()

            if (existingCliente) {
                clienteId = existingCliente.id
            } else {
                const { data: newCliente, error: clienteError } = await supabase
                    .from('clientes')
                    .insert([{ nome, whatsapp: phoneNum }])
                    .select('id')
                    .single()

                if (clienteError) throw clienteError
                clienteId = newCliente.id
            }

            const { error: veiculoError } = await supabase
                .from('veiculos')
                .insert([{
                    placa: placa.toUpperCase(),
                    modelo,
                    cor,
                    cliente_id: clienteId
                }])

            if (veiculoError) {
                if (veiculoError.code === '23505') {
                    throw new Error('Esta placa já está cadastrada no sistema.')
                }
                throw veiculoError
            }

            onSuccess && onSuccess()
        } catch (error) {
            setErrorMsg(error.message || 'Erro ao salvar cliente/veículo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white px-6 py-8 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full">
            {/* Handle bar for bottom sheet indication on mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Novo Cliente</h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">Cadastre o dono e o veículo</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        &times;
                    </button>
                )}
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Cliente Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-brand-600 flex items-center justify-center">
                            <UserPlus className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-bold text-dark-800 uppercase tracking-widest">Informações Pessoais</h3>
                    </div>

                    <div className="space-y-1">
                        <input
                            type="text" required value={nome} onChange={e => setNome(e.target.value)}
                            placeholder="Nome completo"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                            placeholder="WhatsApp (com DDD)"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Veiculo Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
                            <Car className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-bold text-dark-800 uppercase tracking-widest">Veículo</h3>
                    </div>

                    <div>
                        <input
                            type="text" required value={placa} onChange={e => setPlaca(e.target.value)}
                            placeholder="Placa (ABC1234)" maxLength={7}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none uppercase font-bold tracking-widest placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" value={modelo} onChange={e => setModelo(e.target.value)}
                            placeholder="Modelo (Ex: HB20)"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400"
                        />
                        <input
                            type="text" value={cor} onChange={e => setCor(e.target.value)}
                            placeholder="Cor (Ex: Prata)"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-brand-600 text-white rounded-xl shadow-float hover:bg-brand-700 font-bold text-lg disabled:opacity-70 transition-all active:scale-[0.98]"
                    >
                        {loading ? 'Salvando...' : 'Confirmar Cadastro'}
                    </button>
                </div>
            </form>
        </div>
    )
}
