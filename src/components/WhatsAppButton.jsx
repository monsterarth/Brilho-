import { MessageCircle } from 'lucide-react'

export function WhatsAppButton({ to, message }) {
    const sendWhatsApp = async () => {
        try {
            // In production this URL will be handled by the reverse proxy, but right now we make sure we hit the user's defined API path if applicable, 
            // or we can test locally on some default port. Leaving this as the documentation specified.
            const response = await fetch('/api/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: to,
                    message: message
                })
            })
            if (response.ok) alert('WhatsApp enviado!')
            else alert('Falha ao enviar, verifique o backend Docker API.')
        } catch (error) {
            alert('Erro no WhatsApp API connection')
            console.error(error)
        }
    }

    return (
        <button
            onClick={sendWhatsApp}
            className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 flex items-center justify-center gap-2 transition"
        >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
        </button>
    )
}
