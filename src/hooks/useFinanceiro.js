import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFinanceiro(mes, ano) {
    const [transacoes, setTransacoes] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDados()

        const channel = supabase
            .channel('financeiro_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transacoes' }, () => {
                fetchDados()
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias_financeiras' }, () => {
                fetchDados()
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [mes, ano])

    const fetchDados = async () => {
        try {
            setLoading(true)

            // 1. Check categories
            const { data: catData, error: catError } = await supabase
                .from('categorias_financeiras')
                .select('*')
                .order('nome')

            if (catError) throw catError
            setCategorias(catData || [])

            // 2. Transacoes do mês atual
            // Constructing ISO strings for the first and last day of the selected month
            // Note: Postgres timestamps can be filtered via text string comparison if formatted properly,
            // but relying on 'GTE' and 'LT' is best.

            const startDate = new Date(ano, mes - 1, 1).toISOString()
            const endDate = new Date(ano, mes, 1).toISOString()

            const { data: transData, error: transError } = await supabase
                .from('transacoes')
                .select(`
                    *,
                    categorias_financeiras(nome),
                    agendamentos(placa, total)
                `)
                .gte('data_transacao', startDate)
                .lt('data_transacao', endDate)
                .order('data_transacao', { ascending: false })
                .order('created_at', { ascending: false })

            if (transError) throw transError
            setTransacoes(transData || [])

        } catch (error) {
            console.error('Erro ao buscar financeiro:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const addTransacao = async ({ descricao, valor, tipo, data_transacao, categoria_id, os_id }) => {
        const { error } = await supabase
            .from('transacoes')
            .insert([{
                descricao,
                valor: parseFloat(valor),
                tipo,
                data_transacao,
                categoria_id: categoria_id || null,
                os_id: os_id || null
            }])
        return { error }
    }

    const addCategoria = async (nome, tipo) => {
        const { error, data } = await supabase
            .from('categorias_financeiras')
            .insert([{ nome, tipo }])
            .select()
            .single()
        return { error, data }
    }

    const deleteTransacao = async (id) => {
        const { error } = await supabase.from('transacoes').delete().eq('id', id)
        return { error }
    }

    return { transacoes, categorias, loading, addTransacao, addCategoria, deleteTransacao }
}
