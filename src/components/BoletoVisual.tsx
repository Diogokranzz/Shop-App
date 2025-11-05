
interface BoletoVisualProps {
  nomeProjeto: string;
  nomeCliente: string;
  endereco: string;
  produto: string;
  valor: string;
  vencimento: string;
  linhaDigitavel: string;
  codigoBarras: string;
}

export function BoletoVisual({
  nomeProjeto,
  nomeCliente,
  endereco,
  produto,
  valor,
  vencimento,
  linhaDigitavel,
  codigoBarras,
}: BoletoVisualProps) {
  return (
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      background: "#fff",
      border: "2px solid #222",
      borderRadius: 8,
      boxShadow: "0 4px 24px #0002",
      fontFamily: "monospace",
      padding: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {}
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ imageRendering: "pixelated" }}>
            <rect x="0" y="0" width="40" height="40" fill="#fff" />
            <rect x="8" y="8" width="8" height="8" fill="#222" />
            <rect x="24" y="8" width="8" height="8" fill="#222" />
            <rect x="8" y="24" width="8" height="8" fill="#222" />
            <rect x="24" y="24" width="8" height="8" fill="#222" />
            <rect x="16" y="16" width="8" height="8" fill="#222" />
          </svg>
        </div>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>{nomeProjeto}</span>
      </div>
      <hr />
      <div style={{ margin: "16px 0" }}>
        <div><b>Nome do Cliente:</b> {nomeCliente}</div>
        <div><b>Endereço:</b> {endereco}</div>
        <div><b>Produto:</b> {produto}</div>
        <div><b>Valor:</b> R$ {valor}</div>
        <div><b>Vencimento:</b> {vencimento}</div>
      </div>
      <hr />
      <div style={{ margin: "16px 0" }}>
        <div><b>Linha Digitável:</b></div>
        <div style={{ fontSize: 20, letterSpacing: 2, marginBottom: 8 }}>{linhaDigitavel}</div>
        <div><b>Código de Barras:</b></div>
        <img
          src={`https://barcodeapi.org/api/128/${codigoBarras}`}
          alt="Código de Barras"
          style={{ width: "100%", height: 60, background: "#fff", border: "1px solid #222" }}
        />
      </div>
      <hr />
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={() => navigator.clipboard.writeText(linhaDigitavel)}
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Copiar Linha Digitável
        </button>
      </div>
    </div>
  );
}
