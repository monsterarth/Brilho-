import { useState } from 'react'
import { useFinanceiro } from '../hooks/useFinanceiro'
import { format } from 'date-fns'
import { Wallet, Tag, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

export function TransacaoForm({ onSuccess, onCancel }) {
    // Only need mes/ano for the hook to provide categories, though we could just pass it
    const today = new Date()
    const { categorias, loading, addTransacao, addCategoria } = useFinanceiro(today.getMonth() + 1, today.getFullYear())

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Form
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState('')
    const [tipo, setTipo] = useState('despesa') // 'receita' or 'despesa'
    const [dataTransacao, setDataTransacao] = useState(format(today, 'yyyy-MM-dd'))
    const [categoriaId, setCategoriaId] = useState('')

    // Nova Categoria
    const [isNovaCategoria, setIsNovaCategoria] = useState(false)
    const [novaCategoria, setNovaCategoria] = useState('')

    const categoriasFiltradas = categorias.filter(c => c.tipo === tipo)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!descricao || !valor) return

        setIsSubmitting(true)
        setErrorMsg('')

        try {
            let finalCategoriaId = categoriaId

            // Create new category if checked
            if (isNovaCategoria && novaCategoria) {
                const { error: catError, data: catData } = await addCategoria(novaCategoria, tipo)
                if (catError) throw new Error('Erro ao criar categoria.')
                finalCategoriaId = catData.id
            }

            const { error } = await addTransacao({
                descricao,
                valor,
                tipo,
                data_transacao: dataTransacao + 'T12:00:00', // normalize time
                categoria_id: finalCategoriaId
            })

            if (error) throw error
            onSuccess && onSuccess()

        } catch (err) {
            setErrorMsg(err.message || 'Erro ao salvar transação')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white px-6 py-8 pb-32 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight flex items-center gap-2">
                        Novo Lançamento
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">Registre entradas ou saídas manuais</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Tipo de Transação */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 mb-6">
                    <button
                        type="button"
                        onClick={() => { setTipo('despesa'); setCategoriaId(''); setIsNovaCategoria(false) }}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                            tipo === 'despesa' ? "bg-white text-red-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <ArrowDownRight className="w-4 h-4" /> Despesa
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTipo('receita'); setCategoriaId(''); setIsNovaCategoria(false) }}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                            tipo === 'receita' ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <ArrowUpRight className="w-4 h-4" /> Receita
                    </button>
                </div>

                {/* Valor e Data */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                        <Wallet className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                            tipo === 'receita' ? "text-green-500" : "text-red-500"
                        )} />
                        <input
                            type="number" step="0.01" min="0" required
                            value={valor} onChange={e => setValor(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-black text-xl text-dark-900 placeholder:font-medium placeholder:text-gray-400 placeholder:text-base"
                            placeholder="R$ 0,00"
                        />
                    </div>
                    <div className="relative group">
                        <input
                            type="date" required
                            value={dataTransacao} onChange={e => setDataTransacao(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-bold text-dark-800"
                        />
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-1">
                    <input
                        type="text" required
                        value={descricao} onChange={e => setDescricao(e.target.value)}
                        placeholder="Descrição (ex: Conta de Luz, Venda Produto...)"
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium placeholder:text-gray-400"
                    />
                </div>

                {/* Categoria */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-dark-800 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-brand-600" /> Categoria
                        </h3>
                        <label className="flex items-center gap-2 text-xs font-bold text-brand-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isNovaCategoria}
                                onChange={() => setIsNovaCategoria(!isNovaCategoria)}
                                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                            />
                            Nova Categoria
                        </label>
                    </div>

                    {isNovaCategoria ? (
                        <input
                            type="text" required
                            value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)}
                            placeholder={`Nome da nova ${tipo}...`}
                            className="w-full px-4 py-3 bg-white border border-brand-200 rounded-xl outline-none text-sm font-medium focus:border-brand-500"
                        />
                    ) : (
                        <select
                            required
                            value={categoriaId} onChange={e => setCategoriaId(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-brand-500"
                        >
                            <option value="">Selecione uma categoria...</option>
                            {categoriasFiltradas.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className={cn(
                            "w-full h-14 text-white rounded-xl shadow-float font-bold text-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]",
                            tipo === 'receita' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        )}
                    >
                        {isSubmitting ? 'Salvando...' : `Confirmar ${tipo === 'receita' ? 'Entrada' : 'Saída'}`}
                    </button>
                </div>
            </form>
        </div>
    )
}
