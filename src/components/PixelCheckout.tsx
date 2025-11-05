import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  QrCode,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Mail,
  User,
  MapPin,
} from "lucide-react";
import { Input } from "./ui/input";
import { BoletoVisual } from "./BoletoVisual";
import { toast } from "sonner";
import { PixelCartItem } from "./PixelCartDrawer";


function copyToClipboard(text: string): void {
  try {
   
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
       
        fallbackCopy(text);
      });
    } else {
      
      fallbackCopy(text);
    }
  } catch (error) {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.error("Fallback copy failed:", error);
  }
  textArea.remove();
}

interface PixelCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: PixelCartItem[];
  totalAmount: number;
  onClearCart: () => void;
}

type PaymentMethod = "pix" | "credit_card" | "boleto" | null;

interface CustomerData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CardData {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  cardBrand: string;
}

const CARD_BRANDS: { [key: string]: RegExp } = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
};

function detectCardBrand(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, "");
  for (const [brand, regex] of Object.entries(CARD_BRANDS)) {
    if (regex.test(cleanNumber)) {
      return brand;
    }
  }
  return "unknown";
}

function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, "");
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(" ");
}

function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  return cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14);
}

function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  return cleaned
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function formatZipCode(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
}

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
 
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  return true;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function PixelCheckout({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onClearCart,
}: PixelCheckoutProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [pixKey, setPixKey] = useState("");

  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    cardBrand: "",
  });

  const [boletoCode, setBoletoCode] = useState("");

  
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPaymentMethod(null);
      setOrderId("");
      setQrCodeUrl("");
      setPixKey("");
      setBoletoCode("");
    }
  }, [isOpen]);

  
  const validateCustomerData = (): boolean => {
    if (!customerData.fullName.trim()) {
      toast.error("NOME COMPLETO OBRIGATÓRIO");
      return false;
    }
    if (!validateEmail(customerData.email)) {
      toast.error("EMAIL INVÁLIDO");
      return false;
    }
    if (!validateCPF(customerData.cpf)) {
      toast.error("CPF INVÁLIDO");
      return false;
    }
    if (customerData.phone.replace(/\D/g, "").length < 10) {
      toast.error("TELEFONE INVÁLIDO");
      return false;
    }
    if (!customerData.zipCode || !customerData.street || !customerData.number) {
      toast.error("ENDEREÇO INCOMPLETO");
      return false;
    }
    if (!customerData.city || !customerData.state) {
      toast.error("CIDADE E ESTADO OBRIGATÓRIOS");
      return false;
    }
    return true;
  };

  
  const validateCardData = (): boolean => {
    const cleanNumber = cardData.cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      toast.error("NÚMERO DO CARTÃO INVÁLIDO");
      return false;
    }
    if (!cardData.cardName.trim()) {
      toast.error("NOME NO CARTÃO OBRIGATÓRIO");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardData.cardExpiry)) {
      toast.error("VALIDADE INVÁLIDA (MM/AA)");
      return false;
    }
    const [month, year] = cardData.cardExpiry.split("/");
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) {
      toast.error("CARTÃO VENCIDO");
      return false;
    }
    if (cardData.cardCvv.length < 3) {
      toast.error("CVV INVÁLIDO");
      return false;
    }
    return true;
  };

  
  const handleNextStep = () => {
    if (step === 1 && validateCustomerData()) {
      setStep(2);
      toast.success("DADOS CONFIRMADOS");
    } else if (step === 2 && paymentMethod) {
      processPayment();
    }
  };

  
  const processPayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod === "credit_card" && !validateCardData()) {
        setLoading(false);
        return;
      }
      setOrderId(Math.random().toString(36).substring(2, 10).toUpperCase());
      if (paymentMethod === "pix") {
        // Mock Pix
        const chave = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 18);
        const valor = totalAmount.toFixed(2);
        const nome = cartItems[0]?.name || "Produto";
        const formatValue = (val: string) => {
          const s = val.length.toString().padStart(2, "0");
          return `${s}${val}`;
        };
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
        ].join("");
        const pixPayload = `${payload}6304${(
          0x10000 |
          payload.split("").reduce((sum, char) => (sum + char.charCodeAt(0)) & 0xffff, 0xffff)
        )
          .toString(16)
          .toUpperCase()
          .substring(1)}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`;
        setPixKey(pixPayload);
        setQrCodeUrl(qrCodeUrl);
      } else if (paymentMethod === "boleto") {
        // Mock Boleto
        const valor = totalAmount.toFixed(2);
  // nome não é usado diretamente, removido para evitar erro de lint
        const hoje = new Date();
        const vencimentoDate = new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000);
        const fatorVencimento = Math.floor(
          (vencimentoDate.getTime() - new Date("1997-10-07").getTime()) / (1000 * 60 * 60 * 24)
        ).toString();
        const valorFormatado = parseFloat(valor).toFixed(2).replace(".", "").padStart(10, "0");
        const nossoNumero = Math.random().toString().substring(2, 13);
        const baseCodigoBarras = `3419${fatorVencimento}${valorFormatado}${nossoNumero}`;
        const dv = (baseCodigoBarras.split("").reduce((acc, digit) => acc + parseInt(digit), 0) % 9) + 1;
        const codigoBarras = `3419${dv}${fatorVencimento}${valorFormatado}179001010435100479102015000`;
        const linhaDigitavel = `${codigoBarras.substring(0, 5)}.${codigoBarras.substring(5, 10)} ${codigoBarras.substring(10, 15)}.${codigoBarras.substring(15, 21)} ${codigoBarras.substring(21, 26)}.${codigoBarras.substring(26, 32)} ${dv} ${fatorVencimento}${valorFormatado}`;
        setBoletoCode(linhaDigitavel);
      }
      setStep(3);
      toast.success("PEDIDO CONFIRMADO!");
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      toast.error(`ERRO AO PROCESSAR PEDIDO: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  }

  
  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setCustomerData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
        toast.success("ENDEREÇO PREENCHIDO");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-60 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
        }}
      />

      {}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black z-50 shadow-[8px_8px_0_black]"
      >
        {/* Title Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-2 border-b-2 border-black bg-white">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-4 h-4 border-2 border-black bg-white" />
              <div className="w-4 h-4 border-2 border-black bg-white" />
            </div>
            <h3 className="text-sm font-bold">
              CHECKOUT - STEP {step}/3
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-none"
          >
            ✕
          </button>
        </div>

        {}
        <div className="flex border-b-2 border-black bg-[#C0C0C0]">
          {[
            { num: 1, label: "Dados" },
            { num: 2, label: "Pagamento" },
            { num: 3, label: "Confirmação" },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex-1 p-3 text-center border-r-2 last:border-r-0 border-black ${
                step === s.num
                  ? "bg-black text-white"
                  : step > s.num
                  ? "bg-white"
                  : "bg-[#C0C0C0]"
              }`}
            >
              <div className="text-xs font-bold">
                {step > s.num ? "✓" : s.num}. {s.label}
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="p-6 bg-[#C0C0C0]">
          <AnimatePresence mode="wait">
            {}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold mb-4 pb-2 border-b-2 border-dashed border-black">
                    <User className="inline h-4 w-4 mr-2" />
                    DADOS PESSOAIS
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        NOME COMPLETO *
                      </label>
                      <Input
                        value={customerData.fullName}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="border-2 border-black bg-white font-mono"
                        placeholder="João da Silva"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold block mb-1">
                          EMAIL *
                        </label>
                        <Input
                          type="email"
                          value={customerData.email}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                          placeholder="email@exemplo.com"
                        />
                        <p className="text-[10px] text-[#666] mt-1">
                          🧪 Teste: confirmação enviada para diogokranz11@gmail.com
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-1">
                          CPF *
                        </label>
                        <Input
                          value={customerData.cpf}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              cpf: formatCPF(e.target.value),
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">
                        TELEFONE *
                      </label>
                      <Input
                        value={customerData.phone}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            phone: formatPhone(e.target.value),
                          }))
                        }
                        className="border-2 border-black bg-white font-mono"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold mb-4 pb-2 border-b-2 border-dashed border-black">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    ENDEREÇO DE ENTREGA
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        CEP *
                      </label>
                      <Input
                        value={customerData.zipCode}
                        onChange={(e) => {
                          const formatted = formatZipCode(e.target.value);
                          setCustomerData((prev) => ({
                            ...prev,
                            zipCode: formatted,
                          }));
                          if (formatted.replace(/\D/g, "").length === 8) {
                            fetchAddressByCEP(formatted);
                          }
                        }}
                        className="border-2 border-black bg-white font-mono"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-bold block mb-1">
                          RUA *
                        </label>
                        <Input
                          value={customerData.street}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              street: e.target.value,
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-1">
                          NÚMERO *
                        </label>
                        <Input
                          value={customerData.number}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              number: e.target.value,
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">
                        COMPLEMENTO
                      </label>
                      <Input
                        value={customerData.complement}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            complement: e.target.value,
                          }))
                        }
                        className="border-2 border-black bg-white font-mono"
                        placeholder="Apt, Bloco, etc"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">
                        BAIRRO *
                      </label>
                      <Input
                        value={customerData.neighborhood}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            neighborhood: e.target.value,
                          }))
                        }
                        className="border-2 border-black bg-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-bold block mb-1">
                          CIDADE *
                        </label>
                        <Input
                          value={customerData.city}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-1">
                          UF *
                        </label>
                        <Input
                          value={customerData.state}
                          onChange={(e) =>
                            setCustomerData((prev) => ({
                              ...prev,
                              state: e.target.value.toUpperCase(),
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                          maxLength={2}
                          placeholder="SP"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border-2 border-black bg-white hover:bg-[#808080] hover:text-white font-bold transition-none"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 border-2 border-black bg-black text-white hover:bg-[#333] font-bold transition-none flex items-center gap-2"
                  >
                    CONTINUAR <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Forma de Pagamento */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold mb-4 pb-2 border-b-2 border-dashed border-black">
                    ESCOLHA A FORMA DE PAGAMENTO
                  </h4>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-4 border-2 border-black transition-none ${
                        paymentMethod === "pix"
                          ? "bg-black text-white"
                          : "bg-white hover:bg-[#C0C0C0]"
                      }`}
                    >
                      <QrCode className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-xs font-bold">PIX</div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-4 border-2 border-black transition-none ${
                        paymentMethod === "credit_card"
                          ? "bg-black text-white"
                          : "bg-white hover:bg-[#C0C0C0]"
                      }`}
                    >
                      <CreditCard className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-xs font-bold">CARTÃO</div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("boleto")}
                      className={`p-4 border-2 border-black transition-none ${
                        paymentMethod === "boleto"
                          ? "bg-black text-white"
                          : "bg-white hover:bg-[#C0C0C0]"
                      }`}
                    >
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-xs font-bold">BOLETO</div>
                    </button>
                  </div>

                  {/* Formulário de Cartão */}
                  {paymentMethod === "credit_card" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t-2 border-dashed border-black pt-4 space-y-3"
                    >
                      <div>
                        <label className="text-xs font-bold block mb-1">
                          NÚMERO DO CARTÃO *
                        </label>
                        <Input
                          value={cardData.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(
                              e.target.value.replace(/\D/g, "")
                            );
                            const brand = detectCardBrand(formatted);
                            setCardData((prev) => ({
                              ...prev,
                              cardNumber: formatted,
                              cardBrand: brand,
                            }));
                          }}
                          className="border-2 border-black bg-white font-mono"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                        {cardData.cardBrand && cardData.cardBrand !== "unknown" && (
                          <div className="mt-1 text-xs">
                            Bandeira:{" "}
                            <span className="font-bold uppercase">
                              {cardData.cardBrand}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-1">
                          NOME NO CARTÃO *
                        </label>
                        <Input
                          value={cardData.cardName}
                          onChange={(e) =>
                            setCardData((prev) => ({
                              ...prev,
                              cardName: e.target.value.toUpperCase(),
                            }))
                          }
                          className="border-2 border-black bg-white font-mono"
                          placeholder="NOME COMO NO CARTÃO"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold block mb-1">
                            VALIDADE *
                          </label>
                          <Input
                            value={cardData.cardExpiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + "/" + value.slice(2, 4);
                              }
                              setCardData((prev) => ({
                                ...prev,
                                cardExpiry: value,
                              }));
                            }}
                            className="border-2 border-black bg-white font-mono"
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">
                            CVV *
                          </label>
                          <Input
                            type="password"
                            value={cardData.cardCvv}
                            onChange={(e) =>
                              setCardData((prev) => ({
                                ...prev,
                                cardCvv: e.target.value.replace(/\D/g, ""),
                              }))
                            }
                            className="border-2 border-black bg-white font-mono"
                            placeholder="000"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "pix" && (
                    <div className="border-t-2 border-dashed border-black pt-4">
                      <div className="text-sm text-center p-4 bg-[#C0C0C0] border-2 border-black">
                        <QrCode className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-bold mb-1">
                          PAGAMENTO INSTANTÂNEO VIA PIX
                        </p>
                        <p className="text-xs">
                          QR Code será gerado após confirmação
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "boleto" && (
                    <div className="border-t-2 border-dashed border-black pt-4">
                      <div className="text-sm text-center p-4 bg-[#C0C0C0] border-2 border-black">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-bold mb-1">BOLETO BANCÁRIO</p>
                        <p className="text-xs">
                          Vencimento em 3 dias úteis
                          <br />
                          Código será gerado após confirmação
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumo do Pedido */}
                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold mb-3 pb-2 border-b-2 border-dashed border-black">
                    RESUMO DO PEDIDO
                  </h4>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t-2 border-dashed border-black pt-2 mt-2 flex justify-between text-lg font-bold">
                      <span>TOTAL:</span>
                      <span>R$ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border-2 border-black bg-white hover:bg-[#808080] hover:text-white font-bold transition-none flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> VOLTAR
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!paymentMethod || loading}
                    className="px-6 py-2 border-2 border-black bg-black text-white hover:bg-[#333] font-bold transition-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        PROCESSANDO...
                      </>
                    ) : (
                      <>
                        FINALIZAR PEDIDO <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirmação */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-white border-2 border-black p-6 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">
                    PEDIDO CONFIRMADO!
                  </h2>
                  <div className="bg-[#C0C0C0] border-2 border-black p-4 my-4">
                    <p className="text-xs mb-1">NÚMERO DO PEDIDO:</p>
                    <p className="text-xl font-bold font-mono">{orderId}</p>
                  </div>
                  <p className="text-sm mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Confirmação enviada para:
                  </p>
                  <p className="font-bold">{customerData.email}</p>
                </div>

                {/* PIX */}
                {paymentMethod === "pix" && qrCodeUrl && (
                  <div className="bg-white border-2 border-black p-4">
                    <h4 className="font-bold mb-3 text-center">
                      PAGUE COM PIX
                    </h4>
                    <div className="bg-[#C0C0C0] border-2 border-black p-4 mb-3">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code PIX"
                        className="w-48 h-48 mx-auto bg-white p-2 border-2 border-black"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-bold">Chave PIX (Copia e Cola):</p>
                      <div className="bg-[#C0C0C0] border-2 border-black p-2 font-mono text-xs break-all">
                        {qrCodeUrl.split('data=')[1] ? decodeURIComponent(qrCodeUrl.split('data=')[1]) : pixKey}
                      </div>
                      <button
                        onClick={() => {
                          copyToClipboard(pixKey);
                          toast.success("CHAVE PIX COPIADA!");
                        }}
                        className="w-full py-2 border-2 border-black bg-black text-white hover:bg-[#333] font-bold transition-none"
                      >
                        COPIAR CHAVE PIX
                      </button>
                      <p className="text-xs text-center text-[#666] mt-2">
                        ⏱️ Pagamento expira em 30 minutos
                      </p>
                    </div>
                  </div>
                )}

                {/* Boleto */}
                {paymentMethod === "boleto" && boletoCode && (
                  <div className="bg-white border-2 border-black p-4">
                    <BoletoVisual
                      nomeProjeto="EcoWave"
                      nomeCliente={customerData.fullName}
                      endereco={`${customerData.street}, ${customerData.number} - ${customerData.neighborhood}, ${customerData.city} - ${customerData.state}, CEP: ${customerData.zipCode}`}
                      produto={cartItems[0]?.name || "Produto"}
                      valor={totalAmount.toFixed(2)}
                      vencimento={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      linhaDigitavel={boletoCode}
                      codigoBarras={boletoCode.replace(/\D/g, "")}
                    />
                  </div>
                )}

                {/* Cartão */}
                {paymentMethod === "credit_card" && (
                  <div className="bg-white border-2 border-black p-4 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-bold mb-2">
                      PAGAMENTO APROVADO NO CARTÃO
                    </p>
                    <p className="text-sm">
                      Final {cardData.cardNumber.slice(-4)} •{" "}
                      {cardData.cardBrand.toUpperCase()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearCart();
                      onClose();
                      toast.success("OBRIGADO PELA COMPRA!");
                    }}
                    className="flex-1 py-3 border-2 border-black bg-black text-white hover:bg-[#333] font-bold transition-none"
                  >
                    CONCLUIR
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
