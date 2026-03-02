import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useServicos() {
    const [servicos, setServicos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchServicos()
    }, [])

    const fetchServicos = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('servicos')
                .select('*')
                .order('nome', { ascending: true })

            if (error) throw error
            setServicos(data || [])
        } catch (error) {
            console.error('Erro ao buscar serviços:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const addServico = async (nome, preco) => {
        try {
            const { data, error } = await supabase
                .from('servicos')
                .insert([{ nome, preco: parseFloat(preco) }])
                .select()
                .single()

            if (error) throw error
            setServicos(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    const deleteServico = async (id) => {
        try {
            const { error } = await supabase
                .from('servicos')
                .delete()
                .eq('id', id)

            if (error) throw error
            setServicos(prev => prev.filter(s => s.id !== id))
            return { error: null }
        } catch (error) {
            return { error }
        }
    }

    return { servicos, loading, addServico, deleteServico, refreshServicos: fetchServicos }
}
