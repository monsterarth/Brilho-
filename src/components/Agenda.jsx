import { useAgendamentos } from '../hooks/useAgendamentos'
import { WhatsAppButton } from './WhatsAppButton'
import { Calendar, CheckCircle, Clock, MoreVertical, CreditCard } from 'lucide-react'
import { cn } from '../lib/utils'

export function Agenda({ dataSelecionada }) {
    const { agendamentos, updateStatus } = useAgendamentos(dataSelecionada)

    if (!agendamentos.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-brand-500 opacity-50" />
                </div>
                <h3 className="text-[17px] font-bold text-dark-900">Nenhuma OS agendada</h3>
                <p className="text-[13px] font-medium text-gray-400 mt-2 max-w-[200px]">Os agendamentos para o dia {dataSelecionada.split('-').reverse().join('/')} aparecerão aqui.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {agendamentos.map((agendamento, idx) => {
                const isDone = agendamento.status === 'pronto' || agendamento.status === 'pago';
                const isWashing = agendamento.status === 'lavando';

                return (
                    <div
                        key={agendamento.id}
                        className="group relative p-5 rounded-3xl bg-white shadow-soft border border-gray-100/50 hover:shadow-medium transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        {/* Top Row: Plate & Status */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "px-3 py-1.5 rounded-xl font-black text-sm tracking-widest border",
                                    isDone ? "bg-gray-50 border-gray-200 text-gray-400" : "bg-dark-900 border-dark-800 text-white shadow-md"
                                )}>
                                    {agendamento.placa}
                                </div>
                            </div>

                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                                agendamento.status === 'pago' ? 'bg-green-100 text-green-700' :
                                    agendamento.status === 'pronto' ? 'bg-blue-100 text-blue-700' :
                                        agendamento.status === 'lavando' ? 'bg-purple-100 text-purple-700' :
                                            agendamento.status === 'chegou' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                            )}>
                                {agendamento.status}
                            </span>
                        </div>

                        {/* Middle Row: Details */}
                        <div className="flex justify-between items-end mb-5 pl-1">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {agendamento.hora?.slice(0, 5) || '--:--'}
                                </div>
                                <div className="text-sm font-medium text-gray-500 line-clamp-1">
                                    {agendamento.servicos?.map(s => s.nome).join(', ') || 'Lavagem Simples'}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Total</span>
                                <span className={cn(
                                    "text-lg font-black tracking-tight",
                                    isDone ? "text-gray-400" : "text-brand-600"
                                )}>
                                    R$ {Number(agendamento.total).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Row: Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100/80">
                            {agendamento.status !== 'pronto' && agendamento.status !== 'pago' && (
                                <button
                                    onClick={() => {
                                        const nextStatus =
                                            agendamento.status === 'agendado' ? 'chegou' :
                                                agendamento.status === 'chegou' ? 'lavando' : 'pronto';
                                        updateStatus(agendamento.id, nextStatus)
                                    }}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2",
                                        isWashing ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-dark-900 text-white hover:bg-dark-800"
                                    )}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {agendamento.status === 'agendado' ? 'Marcar Chegada' : agendamento.status === 'chegou' ? 'Iniciar Lavagem' : 'Finalizar OS'}
                                </button>
                            )}

                            {agendamento.status === 'pronto' && (
                                <>
                                    <WhatsAppButton
                                        to={agendamento.clientes?.whatsapp || 'whatsapp_cliente'}
                                        message={`Olá! O veículo ${agendamento.placa} está PRONTO no Lava-Jato! Total: R$ ${agendamento.total}`}
                                    />
                                    <button
                                        onClick={() => updateStatus(agendamento.id, 'pago')}
                                        className="flex-1 bg-green-500 text-white shadow-float py-3 px-4 rounded-xl text-xs font-bold hover:bg-green-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Receber R$
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
