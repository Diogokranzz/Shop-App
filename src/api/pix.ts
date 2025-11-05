import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const chave = crypto.randomUUID()
  const valor = req.body?.valor || '119.90'
  const nome = req.body?.nome || 'Carregador Original Tipo Apple 30W'

  const formatValue = (val: string) => {
    const s = val.length.toString().padStart(2, '0')
    return `${s}${val}`
  }

  const payload = [
    `000201`,
    `26${formatValue(`0014br.gov.bcb.pix0136${chave}`)}`,
    `52040000`,
    `5303986`,
    `54${formatValue(valor)}`,
    `5802BR`,
    `59${formatValue(nome.substring(0, 25))}`,
    `6009SAO PAULO`,
    `62070503***`,
  ].join('')

  const pixPayload = `${payload}6304${(
    0x10000 |
    payload.split('').reduce((sum, char) => (sum + char.charCodeAt(0)) & 0xffff, 0xffff)
  )
    .toString(16)
    .toUpperCase()
    .substring(1)}`

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`

  res.status(200).json({ pixKey: chave, pixPayload, qrCodeUrl })
}