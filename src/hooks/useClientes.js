import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useClientes() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClientes()

        const channel = supabase
            .channel('clientes_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, () => {
                fetchClientes()
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'veiculos' }, () => {
                fetchClientes()
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [])

    const fetchClientes = async () => {
        try {
            setLoading(true)
            // Relational querying in Supabase: grab client, their vehicles, and their appointments (linked via vehicles' placa)
            // Since agendamentos points to veiculos(placa), we fetch it indirectly or manually stitch if needed.
            // But we can just fetch all clientes and veiculos, and stitch agendamentos in memory for simplicity on the frontend,
            // or rely on a custom view. Let's fetch clientes -> veiculos first.

            const { data, error } = await supabase
                .from('clientes')
                .select(`
          *,
          veiculos (
            id, placa, modelo, cor,
            agendamentos (
               id, data, hora, status, total, servicos
            )
          )
        `)
                .order('nome', { ascending: true })

            if (error) throw error
            setClientes(data || [])
        } catch (error) {
            console.error('Erro ao buscar clientes:', error.message)
        } finally {
            setLoading(false)
        }
    }

    return { clientes, loading, refreshClientes: fetchClientes }
}
