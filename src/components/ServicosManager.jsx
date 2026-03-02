import { useState } from 'react'
import { useServicos } from '../hooks/useServicos'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'

export function ServicosManager() {
    const { servicos, loading, addServico, deleteServico } = useServicos()
    const [novoServico, setNovoServico] = useState('')
    const [novoPreco, setNovoPreco] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!novoServico || !novoPreco) return
        setIsAdding(true)
        await addServico(novoServico, novoPreco)
        setNovoServico('')
        setNovoPreco('')
        setIsAdding(false)
    }

    return (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Tag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-dark-800 uppercase tracking-widest">Serviços Fixos</h3>
                </div>
                <p className="text-xs text-gray-500 font-medium">Cadastre os serviços e valores padrões para acelerar a criação de ordens de serviço (OS).</p>
            </div>

            <div className="p-2">
                {loading ? (
                    <div className="text-center py-6 text-sm font-bold text-gray-400 animate-pulse">Carregando serviços...</div>
                ) : servicos.length === 0 ? (
                    <div className="text-center py-6 text-sm font-medium text-gray-400">Nenhum serviço cadastrado.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {servicos.map((s) => (
                            <div key={s.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div>
                                    <span className="text-sm font-bold text-dark-800">{s.nome}</span>
                                    <span className="text-xs font-black text-brand-600 ml-2">R$ {Number(s.preco).toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => deleteServico(s.id)}
                                    className="text-gray-300 hover:text-red-500 p-2 rounded-lg opacity-50 group-hover:opacity-100 transition-all"
                                    title="Excluir Serviço"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleAdd} className="p-4 bg-gray-50 border-t border-gray-200/60 mt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Novo Serviço</h4>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Ex: Lavagem Completa"
                        value={novoServico}
                        onChange={e => setNovoServico(e.target.value)}
                        required
                        className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-sm font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                    <input
                        type="number"
                        step="0.01" min="0"
                        placeholder="R$ 50"
                        value={novoPreco}
                        onChange={e => setNovoPreco(e.target.value)}
                        required
                        className="w-24 px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-sm font-black text-dark-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAdding || !novoServico || !novoPreco}
                    className="w-full h-11 bg-dark-900 text-white rounded-xl shadow-md hover:bg-dark-800 active:scale-[0.98] transition-all text-xs font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Serviço
                </button>
            </form>
        </div>
    )
}
