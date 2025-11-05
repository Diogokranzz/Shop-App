import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const valor = req.body?.valor || '119.90'
  const nome = req.body?.nome || 'Carregador Original Tipo Apple 30W'

  const hoje = new Date()
  const vencimentoDate = new Date(hoje.setDate(hoje.getDate() + 3))
  const vencimento = vencimentoDate.toISOString().split('T')[0]

  const fatorVencimento = Math.floor(
    (vencimentoDate.getTime() - new Date('1997-10-07').getTime()) / (1000 * 60 * 60 * 24)
  ).toString()

  const valorFormatado = parseFloat(valor).toFixed(2).replace('.', '').padStart(10, '0')
  const nossoNumero = Math.random().toString().substring(2, 13)

  const baseCodigoBarras = `3419${fatorVencimento}${valorFormatado}${nossoNumero}`
  const dv = (baseCodigoBarras.split('').reduce((acc, digit) => acc + parseInt(digit), 0) % 9) + 1
  const codigoBarras = `3419${dv}${fatorVencimento}${valorFormatado}179001010435100479102015000`
  const linhaDigitavel = `${codigoBarras.substring(0, 5)}.${codigoBarras.substring(5, 10)} ${codigoBarras.substring(10, 15)}.${codigoBarras.substring(15, 21)} ${codigoBarras.substring(21, 26)}.${codigoBarras.substring(26, 32)} ${dv} ${fatorVencimento}${valorFormatado}`

  const pdfUrl = 'https://www.bb.com.br/docs/pub/emp/empl/dwn/BoletoBB.pdf'

  res.status(200).json({ valor, nome, vencimento, linhaDigitavel, codigoBarras, pdfUrl, nossoNumero })
}
