import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAgendamentos(filtroData) {
    const [agendamentos, setAgendamentos] = useState([])

    useEffect(() => {
        fetchAgendamentos()

        // Realtime subscription
        const channel = supabase
            .channel('agenda_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'agendamentos' },
                () => {
                    fetchAgendamentos()
                }
            )
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [filtroData])

    const fetchAgendamentos = async () => {
        let query = supabase.from('agendamentos').select('*, veiculos(placa)').order('data').order('hora')

        if (filtroData) {
            query = query.eq('data', filtroData)
        }

        const { data } = await query

        // Formatting relational data if needed, or simply pass through
        const formattedData = data?.map(a => ({
            ...a,
            placa: a.veiculos?.placa || a.placa // Fallback
        }))

        setAgendamentos(formattedData || [])
    }

    const updateStatus = async (id, status) => {
        const { error } = await supabase
            .from('agendamentos')
            .update({ status })
            .eq('id', id)
        return error
    }

    return { agendamentos, updateStatus }
}
