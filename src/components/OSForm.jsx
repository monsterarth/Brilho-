import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, Tag, Plus, Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../lib/utils'

export function OSForm({ onSuccess, onCancel, dataInicial = new Date() }) {
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [searchFeedback, setSearchFeedback] = useState('')
    const [placaExists, setPlacaExists] = useState(false)

    // Form State
    const [placa, setPlaca] = useState('')
    const [data, setData] = useState(format(dataInicial, 'yyyy-MM-dd'))
    const [hora, setHora] = useState('08:00')
    const [observacoes, setObservacoes] = useState('')
    const [servicos, setServicos] = useState([{ nome: '', preco: '' }])

    const checkPlaca = async (p) => {
        if (p.length < 7) {
            setSearchFeedback('')
            setPlacaExists(false)
            return
        }
        const { data: v } = await supabase.from('veiculos').select('modelo, clientes(nome)').eq('placa', p.toUpperCase()).single()
        if (v) {
            setSearchFeedback(`${v.modelo || 'Veículo'} de ${v.clientes?.nome}`)
            setPlacaExists(true)
        } else {
            setSearchFeedback('Placa não encontrada.')
            setPlacaExists(false)
        }
    }

    const handlePlacaChange = (e) => {
        const val = e.target.value.toUpperCase()
        setPlaca(val)
        checkPlaca(val)
    }

    const handleAddServico = () => setServicos([...servicos, { nome: '', preco: '' }])

    const handleServicoChange = (index, field, value) => {
        const newServicos = [...servicos]
        newServicos[index][field] = value
        setServicos(newServicos)
    }

    const handleRemoveServico = (index) => {
        setServicos(servicos.filter((_, i) => i !== index))
    }

    const calcularTotal = () => {
        return servicos.reduce((acc, current) => {
            const v = parseFloat(current.preco)
            return acc + (isNaN(v) ? 0 : v)
        }, 0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        if (servicos.length === 0 || servicos.every(s => !s.nome || !s.preco)) {
            setErrorMsg('Adicione pelo menos um serviço com preço.')
            setLoading(false)
            return
        }

        try {
            if (!placaExists) throw new Error('Cadastre a placa no menu Cliente/Veículo antes.')

            const total = calcularTotal()
            const formatados = servicos.filter(s => s.nome && s.preco).map(s => ({
                nome: s.nome,
                preco: parseFloat(s.preco)
            }))

            const { error } = await supabase
                .from('agendamentos')
                .insert([{
                    placa,
                    data,
                    hora,
                    observacoes,
                    servicos: formatados,
                    total: total,
                    status: 'agendado'
                }])

            if (error) throw error
            onSuccess && onSuccess()

        } catch (error) {
            setErrorMsg(error.message || 'Erro ao agendar a OS.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white px-6 py-8 pb-32 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight flex items-center gap-2">
                        Nova OS
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">Crie um ticket de lavagem</p>
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
                {/* Veículo Selector */}
                <div className="relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {placa.length === 7 && placaExists && <Check className="w-5 h-5 text-green-500 animate-fade-in" strokeWidth={3} />}
                    </div>
                    <input
                        type="text" required value={placa} onChange={handlePlacaChange}
                        placeholder="Placa do Veículo (ABC1234)" maxLength={7}
                        className={cn(
                            "w-full px-4 pt-5 pb-2 bg-gray-50/50 border-b-2 rounded-t-xl focus:bg-white focus:outline-none transition-all uppercase font-black text-xl tracking-widest placeholder:normal-case placeholder:font-medium placeholder:text-base placeholder:tracking-normal placeholder:text-gray-400",
                            placa.length === 7 ? (placaExists ? "border-green-500 text-green-900 bg-green-50/30" : "border-red-500 text-red-900 bg-red-50/30") : "border-gray-200 focus:border-brand-500 text-dark-900"
                        )}
                    />
                    {searchFeedback && (
                        <p className={cn("text-xs mt-1.5 font-bold px-2", placaExists ? "text-green-600" : "text-red-500")}>
                            {placaExists ? '✓' : '✖'} {searchFeedback}
                        </p>
                    )}
                </div>

                {/* Data & Hora Segmentadas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="date" required value={data} onChange={e => setData(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-bold text-dark-800"
                        />
                    </div>
                    <div className="relative group">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="time" required value={hora} onChange={e => setHora(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-bold text-dark-800"
                        />
                    </div>
                </div>

                {/* Dynamic Services List */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-dark-800 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-brand-600" /> Serviços
                        </h3>
                        <button
                            type="button"
                            onClick={handleAddServico}
                            className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center hover:bg-brand-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" strokeWidth={3} />
                        </button>
                    </div>

                    {servicos.map((servico, index) => (
                        <div key={index} className="flex gap-2 items-center animate-fade-in group">
                            <input
                                type="text" required placeholder="Nome do serviço"
                                value={servico.nome} onChange={e => handleServicoChange(index, 'nome', e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium focus:border-brand-500"
                            />
                            <input
                                type="number" required placeholder="R$" step="0.01" min="0"
                                value={servico.preco} onChange={e => handleServicoChange(index, 'preco', e.target.value)}
                                className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold text-dark-900 focus:border-brand-500"
                            />
                            {servicos.length > 1 && (
                                <button type="button" onClick={() => handleRemoveServico(index)} className="p-2 text-gray-400 hover:text-red-500 rounded transition-colors opacity-50 hover:opacity-100">
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200/60">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Previsto</span>
                        <span className="text-2xl font-black text-brand-600 tracking-tight">R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                </div>

                <div>
                    <textarea
                        rows={2} value={observacoes} onChange={e => setObservacoes(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium text-sm placeholder:text-gray-400 resize-none"
                        placeholder="Alguma observação especial para a equipe?"
                    />
                </div>

                {/* Sticky Botton Action for Mobile UX */}
                <div className="fixed bottom-0 left-0 right-0 p-4 pb-[env(safe-area-inset-bottom)] bg-white border-t border-gray-100 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
                    <div className="max-w-lg mx-auto flex gap-3 w-full">
                        <button
                            type="submit"
                            disabled={loading || !placaExists}
                            className="flex-1 h-14 bg-brand-600 text-white rounded-2xl shadow-float hover:bg-brand-700 font-bold text-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                        >
                            {loading ? 'Criando OS...' : 'Agendar Lavagem'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
