import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, Copy, MessageCircle, CheckCircle2, Download } from 'lucide-react';
import { CartItem } from '../types';
import { useState } from 'react';
import { SOCIAL_LINKS, DISCOUNT_CODES } from '../constants';
import { jsPDF } from 'jspdf';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string | undefined, color: string | undefined, delta: number) => void;
  onRemove: (id: string, size: string | undefined, color: string | undefined) => void;
  onClearCart: () => void;
  onOrderComplete?: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClearCart, onOrderComplete }: CartProps) {
  const [orderStep, setOrderStep] = useState<'cart' | 'summary'>('cart');
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, type: 'percentage' | 'fixed', value: number} | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = appliedDiscount 
    ? (appliedDiscount.type === 'percentage' ? subtotal * appliedDiscount.value : appliedDiscount.value * totalItems)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setDiscountError('Please enter a code');
      return;
    }
    
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount({ code, ...DISCOUNT_CODES[code] });
      setDiscountError('');
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  const handleGenerateOrder = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setOrderId(id);
    setOrderStep('summary');
  };

  const createPDFDoc = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ASTRO CLOTHING", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text("ORDER SUMMARY", 105, 30, { align: "center" });
    
    // Order Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Order ID: #${orderId}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);
    
    // Table Header
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Size/Color", 140, y);
    doc.text("Price", 170, y);
    
    // Table Content
    y += 10;
    doc.setFont("helvetica", "normal");
    items.forEach(item => {
      doc.text(item.name.substring(0, 40), 20, y);
      doc.text(item.quantity.toString(), 120, y);
      const sizeColor = [item.selectedSize, item.selectedColor].filter(Boolean).join(' / ');
      doc.text(sizeColor || '-', 140, y);
      doc.text(`${item.price * item.quantity} MZN`, 170, y);
      y += 10;
    });
    
    // Totals
    y += 5;
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.text(`Subtotal:`, 140, y);
    doc.text(`${subtotal} MZN`, 170, y);
    y += 10;
    
    if (appliedDiscount) {
      doc.setTextColor(0, 128, 0);
      const discountText = appliedDiscount.type === 'percentage' 
        ? `${appliedDiscount.value * 100}% OFF` 
        : `-${appliedDiscount.value} MZN`;
      doc.text(`Discount (${appliedDiscount.code}):`, 100, y);
      doc.text(`-${discountAmount} MZN`, 170, y);
      doc.setTextColor(0, 0, 0);
      y += 10;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, 140, y);
    doc.text(`${total} MZN`, 170, y);
    
    // Footer / Instructions
    y += 25;
    doc.setFontSize(10);
    doc.text("Payment Instructions:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text("Please send this PDF along with your payment proof (in PDF format)", 20, y);
    y += 7;
    doc.text("to our WhatsApp to confirm your order.", 20, y);
    
    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = createPDFDoc();
    doc.save(`ASTRO_Order_${orderId}.pdf`);
    setSuccessMessage('PDF Downloaded!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleWhatsAppOrder = () => {
    const doc = createPDFDoc();
    const fileName = `ASTRO_Order_${orderId}.pdf`;
    
    // O WhatsApp não permite anexar ficheiros automaticamente através de um link web.
    // A solução é fazer o download do PDF e abrir o WhatsApp com as instruções para o cliente anexar.
    const text = `Hi ASTRO! I'm reaching out to confirm my order (#${orderId}).\n\nI will attach the Order PDF that was just downloaded to my device, along with the PDF of my payment proof.`;

    // 1. Faz o download automático do PDF para o dispositivo do cliente
    doc.save(fileName);

    // 2. Abre o WhatsApp diretamente no número da loja com a mensagem pré-preenchida
    const encodedText = encodeURIComponent(text);
    window.open(`${SOCIAL_LINKS.whatsapp}?text=${encodedText}`, '_blank');
    
    setSuccessMessage('Order sent successfully!');
    if (onOrderComplete) onOrderComplete();
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      setTimeout(() => {
        onClearCart();
        setOrderStep('cart');
      }, 500);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setOrderStep('cart'), 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[160] w-full max-w-md h-full bg-white dark:bg-black shadow-2xl flex flex-col"
          >
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 shadow-xl flex items-center gap-3 z-[200] rounded-full whitespace-nowrap"
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold tracking-tighter uppercase">
                {orderStep === 'cart' ? 'Your Bag' : 'Order Summary'}
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {orderStep === 'cart' ? (
                items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <ShoppingBag size={64} className="mb-6" />
                    <p className="text-sm uppercase tracking-widest font-bold">Your bag is empty</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6">
                        <div className="w-24 aspect-[3/4] bg-gray-100 dark:bg-zinc-900 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest">{item.name}</h3>
                            <button 
                              onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor)}
                              className="opacity-30 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4">
                            {[item.selectedSize, item.selectedColor].filter(Boolean).join(' / ')}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-black/10 dark:border-white/10">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-display font-bold">{item.price * item.quantity} MZN</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-8">
                  <div className="bg-gray-50 dark:bg-zinc-900 p-6 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-6 border-b border-black/10 dark:border-white/10 pb-4">
                      <span className="text-xs uppercase tracking-widest font-bold">Order ID</span>
                      <span className="text-sm font-display font-bold">#{orderId}</span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-xs">
                          <span className="opacity-70">{item.quantity}x {item.name} ({[item.selectedSize, item.selectedColor].filter(Boolean).join(' / ')})</span>
                          <span className="font-bold">{item.price * item.quantity} MZN</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-black/10 dark:border-white/10 pt-4">
                      <span className="text-xs uppercase tracking-widest font-bold">Subtotal</span>
                      <span className="text-sm font-display font-bold">{subtotal} MZN</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center pt-2 text-green-600 dark:text-green-400">
                        <span className="text-xs uppercase tracking-widest font-bold">Discount ({appliedDiscount.code})</span>
                        <span className="text-sm font-display font-bold">-{discountAmount} MZN</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-black/10 dark:border-white/10 mt-4 pt-4">
                      <span className="text-xs uppercase tracking-widest font-bold">Total</span>
                      <span className="text-xl font-display font-bold">{total} MZN</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Como Fazer a Encomenda</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 leading-relaxed">
                          <strong className="opacity-100">Confirme o Stock:</strong> Antes de fazer qualquer pagamento, envie-nos uma mensagem para confirmar se os produtos estão disponíveis.
                        </p>
                      </div>
                      
                      <div className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 leading-relaxed">
                          <strong className="opacity-100">Faça o Pagamento:</strong> Pague via M-Pesa, e-Mola, mKesh ou Transferência Bancária e guarde o comprovativo em formato PDF.
                        </p>
                      </div>

                      <div className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 leading-relaxed">
                          <strong className="opacity-100">Envie os PDFs:</strong> Clique no botão abaixo para baixar o PDF da encomenda e abrir o WhatsApp. Envie-nos o PDF da encomenda junto com o PDF do pagamento.
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-[10px] uppercase tracking-widest font-bold border border-yellow-200 dark:border-yellow-800/30 text-center">
                      Atenção: Não aceitamos pagamentos automáticos no site.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50 dark:bg-zinc-950 border-t border-black/5 dark:border-white/5">
              {orderStep === 'cart' ? (
                <>
                  <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Discount Code</p>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                        <span className="text-xs font-bold text-green-800 dark:text-green-200 uppercase tracking-widest">
                          {appliedDiscount.code} ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value * 100}% OFF` : `-${appliedDiscount.value} MZN/peça`})
                        </span>
                        <button 
                          onClick={handleRemoveDiscount}
                          className="text-green-800 dark:text-green-200 hover:opacity-70"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={discountCode}
                            onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                            placeholder="ENTER CODE"
                            className="flex-1 p-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 focus:outline-none focus:border-black dark:focus:border-white text-xs uppercase tracking-widest"
                          />
                          <button 
                            onClick={handleApplyDiscount}
                            className="px-4 bg-black dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-widest font-bold hover:opacity-80 transition-opacity"
                          >
                            Apply
                          </button>
                        </div>
                        {discountError && <p className="text-red-500 text-[10px] uppercase tracking-widest mt-2">{discountError}</p>}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-[10px] uppercase tracking-widest font-bold border border-yellow-200 dark:border-yellow-800/30 text-center">
                    Antes de fazer o pagamento consulte se o produto em causa tem em stock
                  </div>
                  
                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Subtotal</p>
                      <p className="text-lg font-display font-bold">{subtotal} MZN</p>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-end text-green-600 dark:text-green-400">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Discount</p>
                        <p className="text-lg font-display font-bold">-{discountAmount} MZN</p>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-4 border-t border-black/10 dark:border-white/10">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Total</p>
                      <p className="text-3xl font-display font-bold">{total} MZN</p>
                    </div>
                  </div>
                  
                  <button 
                    disabled={items.length === 0}
                    onClick={handleGenerateOrder}
                    className="w-full py-5 bg-black dark:bg-white text-white dark:text-black text-sm uppercase tracking-[0.3em] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Generate Order
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full py-4 bg-[#25D366] text-white text-xs uppercase tracking-[0.2em] font-bold hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Share PDF to WhatsApp
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="w-full py-4 border border-black dark:border-white text-black dark:text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download Order PDF
                  </button>
                  <button 
                    onClick={() => setOrderStep('cart')}
                    className="w-full py-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mt-2"
                  >
                    Back to Cart
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
