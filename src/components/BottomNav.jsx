import { Calendar, Users, Settings, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

export function BottomNav({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'agenda', icon: Calendar, label: 'Agenda' },
        { id: 'clientes', icon: Users, label: 'Clientes' },
        { id: 'ajustes', icon: Settings, label: 'Ajustes' },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 pb-[env(safe-area-inset-bottom)] z-40">
            <div className="flex items-center justify-around h-16 px-6 max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-all duration-200",
                                isActive ? "text-blue-600 scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <div className={cn(
                                "relative p-1 rounded-xl transition-colors",
                                isActive && "bg-blue-50"
                            )}>
                                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-opacity",
                                isActive ? "opacity-100" : "opacity-0"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
