import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Agenda } from '../components/Agenda'
import { BottomNav } from '../components/BottomNav'
import { ClienteForm } from '../components/ClienteForm'
import { OSForm } from '../components/OSForm'
import { ServicosManager } from '../components/ServicosManager'
import { ListaClientes } from '../components/ListaClientes'
import { Financeiro } from '../components/Financeiro'
import { TransacaoForm } from '../components/TransacaoForm'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Car, Plus, LogOut } from 'lucide-react'
import { cn } from '../lib/utils'

export function Dashboard() {
    const { user, signOut } = useAuth()
    const [dataSelecionada, setDataSelecionada] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [activeTab, setActiveTab] = useState('agenda')

    // Modal states
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false)
    const [isOSModalOpen, setIsOSModalOpen] = useState(false)
    const [isTransacaoModalOpen, setIsTransacaoModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans pb-24">
            {/* Premium Top App Bar */}
            <header className="bg-surface sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-soft border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-md">
                        <Car className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-dark-900 to-brand-900 leading-none">NO BRILHO</h1>
                        <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest mt-1">Lava-Jato</p>
                    </div>
                </div>

                <button
                    onClick={signOut}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Sair"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 animation-fade-in relative">

                {/* Dynamic Header based on Tab */}
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">
                            {activeTab === 'agenda' ? 'Agenda do Dia' : activeTab === 'clientes' ? 'Meus Clientes' : activeTab === 'financeiro' ? 'Financeiro' : 'Ajustes'}
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {activeTab === 'agenda' ? 'Visão geral dos serviços' : activeTab === 'clientes' ? 'Gerenciamento de frota' : activeTab === 'financeiro' ? 'Controle de Caixa' : 'Configurações do App'}
                        </p>
                    </div>

                    {activeTab === 'agenda' && (
                        <div className="relative">
                            <input
                                type="date"
                                value={dataSelecionada}
                                onChange={(e) => setDataSelecionada(e.target.value)}
                                className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
                            />
                            <div className="pointer-events-none flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 shadow-sm relative overflow-hidden">
                                <CalendarIcon className="w-5 h-5" />
                                {/* Visual indicator that a date is selected */}
                                {dataSelecionada !== format(new Date(), 'yyyy-MM-dd') && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-600 rounded-full"></span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Tab Rendering */}
                <section className={cn("transition-opacity duration-300", activeTab === 'agenda' ? 'opacity-100 block' : 'hidden')}>
                    <Agenda dataSelecionada={dataSelecionada} />
                </section>

                <section className={cn("transition-opacity duration-300", activeTab === 'clientes' ? 'opacity-100 block' : 'hidden')}>
                    <ListaClientes />
                </section>

                <section className={cn("transition-opacity duration-300", activeTab === 'financeiro' ? 'opacity-100 block' : 'hidden')}>
                    <Financeiro onNovaTransacao={() => setIsTransacaoModalOpen(true)} />
                </section>

                <section className={cn("transition-opacity duration-300", activeTab === 'ajustes' ? 'opacity-100 block' : 'hidden')}>
                    <ServicosManager />
                </section>
            </main>

            {/* Central Floating Action Button (FAB) for Nova OS */}
            <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-6 z-40">
                <button
                    onClick={() => setIsOSModalOpen(true)}
                    className="w-14 h-14 bg-brand-600 text-white rounded-full shadow-float flex items-center justify-center hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    <Plus className="w-6 h-6" strokeWidth={3} />
                </button>
            </div>

            {/* Secondary FAB for Novo Cliente */}
            <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-24 z-40">
                <button
                    onClick={() => setIsClienteModalOpen(true)}
                    className="px-4 h-12 bg-white text-dark-800 rounded-full shadow-medium flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all duration-300 border border-gray-100 font-bold text-sm"
                >
                    + Cliente
                </button>
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Modern Modals (Bottom Sheets) */}
            {isClienteModalOpen && (
                <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animation-fade-in p-0 sm:p-4">
                    <div className="w-full max-w-md animate-slide-up sm:animate-none">
                        <ClienteForm
                            onSuccess={() => setIsClienteModalOpen(false)}
                            onCancel={() => setIsClienteModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {isOSModalOpen && (
                <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animation-fade-in p-0 sm:p-4">
                    <div className="w-full max-w-lg animate-slide-up sm:animate-none max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-xl bg-white hide-scrollbar">
                        <OSForm
                            dataInicial={new Date(dataSelecionada + 'T12:00:00')}
                            onSuccess={() => setIsOSModalOpen(false)}
                            onCancel={() => setIsOSModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {isTransacaoModalOpen && (
                <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animation-fade-in p-0 sm:p-4">
                    <div className="w-full max-w-lg animate-slide-up sm:animate-none max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-xl bg-gray-50 hide-scrollbar shadow-2xl">
                        <TransacaoForm
                            onSuccess={() => setIsTransacaoModalOpen(false)}
                            onCancel={() => setIsTransacaoModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
