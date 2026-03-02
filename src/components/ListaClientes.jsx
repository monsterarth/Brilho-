import { useState } from 'react'
import { useClientes } from '../hooks/useClientes'
import { ClienteProfile } from './ClienteProfile'
import { Search, UserCircle, ChevronRight, Car } from 'lucide-react'

export function ListaClientes() {
    const { clientes, loading } = useClientes()
    const [busca, setBusca] = useState('')
    const [clienteSelecionado, setClienteSelecionado] = useState(null)

    const clientesFiltrados = clientes.filter(c => {
        const termo = busca.toLowerCase()
        const byName = c.nome.toLowerCase().includes(termo)
        const byPhone = c.whatsapp.includes(termo)
        const byPlata = c.veiculos?.some(v => v.placa.toLowerCase().includes(termo))
        return byName || byPhone || byPlata
    })

    return (
        <div className="flex flex-col h-full animate-fade-in pb-20">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nome, telefone ou placa..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 bg-white shadow-sm border border-gray-100 rounded-2xl outline-none text-sm font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-400">Carregando frota...</p>
                </div>
            ) : clientesFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <UserCircle className="w-12 h-12 text-gray-300 mb-2" />
                    <h3 className="text-[15px] font-bold text-dark-900">Nenhum cliente encontrado</h3>
                    <p className="text-xs font-medium text-gray-400 mt-1">Refine a busca ou adicione um novo.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {clientesFiltrados.map((cliente) => (
                        <button
                            key={cliente.id}
                            onClick={() => setClienteSelecionado(cliente)}
                            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-brand-200 transition-all text-left group"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                <span className="font-black text-lg">{cliente.nome.charAt(0).toUpperCase()}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-dark-900 truncate">{cliente.nome}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-medium text-gray-500">{cliente.whatsapp}</span>
                                    {cliente.veiculos?.length > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                                                <Car className="w-3 h-3" /> {cliente.veiculos.length}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors" />
                        </button>
                    ))}
                </div>
            )}

            {/* Cliente Profile Bottom Sheet */}
            {clienteSelecionado && (
                <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animation-fade-in p-0 sm:p-4">
                    <div className="w-full max-w-lg animate-slide-up sm:animate-none max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-xl bg-gray-50 hide-scrollbar shadow-2xl">
                        <ClienteProfile
                            cliente={clienteSelecionado}
                            onClose={() => setClienteSelecionado(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
