import { useState, useMemo } from 'react'
import { useFinanceiro } from '../hooks/useFinanceiro'
import { format, parseISO } from 'date-fns'
import { TrendingUp, TrendingDown, Wallet, Calendar, Plus, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'

export function Financeiro({ onNovaTransacao }) {
    const today = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(today.getMonth() + 1)
    const [anoSelecionado, setAnoSelecionado] = useState(today.getFullYear())

    const { transacoes, loading, deleteTransacao } = useFinanceiro(mesSelecionado, anoSelecionado)

    const resumo = useMemo(() => {
        return transacoes.reduce((acc, curr) => {
            const val = parseFloat(curr.valor) || 0
            if (curr.tipo === 'receita') acc.receitas += val
            if (curr.tipo === 'despesa') acc.despesas += val
            return acc
        }, { receitas: 0, despesas: 0 })
    }, [transacoes])

    const saldoLiquido = resumo.receitas - resumo.despesas

    // Grouping transactions by date
    const agrupadas = transacoes.reduce((acc, t) => {
        const d = t.data_transacao.split('T')[0]
        if (!acc[d]) acc[d] = []
        acc[d].push(t)
        return acc
    }, {})

    const handleAntMes = () => {
        if (mesSelecionado === 1) { setMesSelecionado(12); setAnoSelecionado(a => a - 1) }
        else { setMesSelecionado(m => m - 1) }
    }

    const handleProxMes = () => {
        if (mesSelecionado === 12) { setMesSelecionado(1); setAnoSelecionado(a => a + 1) }
        else { setMesSelecionado(m => m + 1) }
    }

    return (
        <div className="animate-fade-in relative pb-32">

            {/* Month Selector */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                <button onClick={handleAntMes} className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                    &larr;
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black tracking-widest text-brand-600 uppercase">Mês de Referência</span>
                    <span className="text-lg font-bold text-dark-900">{format(new Date(anoSelecionado, mesSelecionado - 1), 'MMMM yyyy')}</span>
                </div>
                <button onClick={handleProxMes} className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                    &rarr;
                </button>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">

                {/* Saldo / Receitas */}
                <div className="col-span-2 bg-gradient-to-tr from-brand-600 to-brand-400 p-5 rounded-3xl shadow-float text-white">
                    <div className="flex items-center gap-2 text-brand-100 mb-2 font-bold uppercase text-xs tracking-widest">
                        <Wallet className="w-4 h-4" /> Saldo Líquido
                    </div>
                    <div className="text-4xl font-black tracking-tighter">
                        R$ {saldoLiquido.toFixed(2)}
                    </div>
                </div>

                {/* Sub Cards */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" /> Receitas
                    </div>
                    <div className="text-xl font-black text-dark-900">R$ {resumo.receitas.toFixed(2)}</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" /> Despesas
                    </div>
                    <div className="text-xl font-black text-dark-900">R$ {resumo.despesas.toFixed(2)}</div>
                </div>
            </div>

            {/* Extrato Detail */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-dark-800">Extrato</h3>
                    <button
                        onClick={onNovaTransacao}
                        className="text-xs font-black text-brand-600 uppercase tracking-widest px-3 py-1.5 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors flex items-center gap-1"
                    >
                        + Lançar
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm font-bold text-gray-400">Puxando extrato...</p>
                    </div>
                ) : transacoes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                        <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                        <h4 className="text-[15px] font-bold text-dark-900">Nenhuma transação</h4>
                        <p className="text-xs font-medium text-gray-400 mt-1">Neste mês não houve movimentação.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.keys(agrupadas).sort((a, b) => new Date(b) - new Date(a)).map(data => (
                            <div key={data} className="relative z-0">
                                <div className="sticky top-16 z-10 bg-gray-50/95 backdrop-blur-sm py-2 px-1 text-xs font-black uppercase text-gray-400 mb-2 inline-flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                                    {format(parseISO(`${data}T12:00:00`), 'dd/MM/yyyy')}
                                </div>
                                <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                                    {agrupadas[data].map(t => (
                                        <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        t.tipo === 'receita' ? "bg-green-500" : "bg-red-500"
                                                    )} />
                                                    <h5 className="font-bold text-dark-900 truncate text-sm">{t.descricao}</h5>
                                                    {t.agendamentos && (
                                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">OS: {t.agendamentos.placa}</span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3">
                                                    {t.categorias_financeiras?.nome || 'Sem Categoria'}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={cn(
                                                    "font-black tracking-tight",
                                                    t.tipo === 'receita' ? "text-green-600" : "text-red-500"
                                                )}>
                                                    {t.tipo === 'receita' ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
                                                </span>

                                                {/* Excluir Transacao (Only manual non-OS bounded) */}
                                                {!t.os_id && (
                                                    <button onClick={() => deleteTransacao(t.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
