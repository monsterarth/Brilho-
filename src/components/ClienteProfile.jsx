import { Phone, Car, Clock, ShieldCheck, History } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { WhatsAppButton } from './WhatsAppButton'
import { cn } from '../lib/utils'

export function ClienteProfile({ cliente, onClose }) {
    // Aggregate history from all vehicles
    const historicoOS = cliente.veiculos?.reduce((acc, v) => {
        if (v.agendamentos) {
            v.agendamentos.forEach(a => acc.push({ ...a, placa: v.placa }))
        }
        return acc
    }, []) || []

    // Sort OS by latest
    historicoOS.sort((a, b) => new Date(b.data) - new Date(a.data))

    return (
        <div className="bg-gray-50 pb-32 w-full min-h-[70vh]">
            {/* Handle bar for bottom sheet indication */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-4 sm:hidden" />

            {/* Header Profile */}
            <div className="px-6 pb-6 pt-2 bg-white rounded-b-[2rem] shadow-sm relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg">
                        <span className="font-black text-2xl tracking-tighter">{cliente.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        &times;
                    </button>
                </div>

                <h2 className="text-2xl font-black text-dark-900 tracking-tight leading-none mb-1">{cliente.nome}</h2>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5 group cursor-pointer hover:text-brand-600 transition-colors">
                        <Phone className="w-4 h-4" /> {cliente.whatsapp}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Cliente Ativo
                    </div>
                </div>

                {/* Quick Action - WhatsApp Link */}
                <div className="mt-6 flex">
                    <WhatsAppButton
                        to={cliente.whatsapp}
                        message={`Olá ${cliente.nome.split(' ')[0]}! Tudo bem?`}
                        className="flex-1 rounded-xl shadow-float justify-center py-3.5 bg-green-500 font-bold hover:bg-green-600"
                    />
                </div>
            </div>

            <div className="px-6 mt-6 space-y-8">

                {/* Garagem / Vehicles */}
                <section>
                    <h3 className="text-[13px] font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                        <Car className="w-4 h-4" /> Garagem
                    </h3>
                    <div className="space-y-3">
                        {!cliente.veiculos || cliente.veiculos.length === 0 ? (
                            <p className="text-sm font-medium text-gray-400 italic">Nenhum veículo cadastrado.</p>
                        ) : (
                            cliente.veiculos.map(v => (
                                <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-dark-900 uppercase tracking-widest">{v.placa}</span>
                                        <span className="text-xs font-medium text-gray-500">{v.modelo} &bull; {v.cor}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <Car className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-3 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all">
                        + Adicionar Veículo (Em breve)
                    </button>
                </section>

                {/* Historico de OS */}
                <section>
                    <h3 className="text-[13px] font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                        <History className="w-4 h-4" /> Histórico de OS
                    </h3>
                    <div className="space-y-3 relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-2 bottom-4 w-px bg-gray-200 z-0" />

                        {historicoOS.length === 0 ? (
                            <p className="text-sm font-medium text-gray-400 italic ml-10">Nenhum serviço realizado ainda.</p>
                        ) : (
                            historicoOS.map((os) => (
                                <div key={os.id} className="relative z-10 pl-10">
                                    <div className="absolute left-[13px] top-4 w-2 h-2 rounded-full bg-brand-500 border-4 border-gray-50 box-content" />
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className={cn(
                                                    "inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-1",
                                                    os.status === 'pago' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                )}>
                                                    {os.placa}
                                                </span>
                                                <h4 className="text-sm font-bold text-dark-900 line-clamp-1">
                                                    {os.servicos?.map(s => s.nome).join(', ')}
                                                </h4>
                                            </div>
                                            <span className="text-xs font-black text-brand-600 whitespace-nowrap">
                                                R$ {Number(os.total).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {format(parseISO(`${os.data}T12:00:00`), 'dd/MM/yyyy')}
                                            <span className="mx-1">&bull;</span>
                                            <span className="uppercase">{os.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}
