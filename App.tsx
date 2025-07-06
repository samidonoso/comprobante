
import React, { useState, useCallback } from 'react';
import { ReceiptData } from './types';
import Header from './components/Header';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import { generateTripDetails } from './services/geminiService';
import { SparklesIcon, DocumentDuplicateIcon } from './components/icons/Icons';

const App: React.FC = () => {
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleGenerateReceipt = useCallback((formData: Omit<ReceiptData, 'receiptNumber' | 'receiptDate'>) => {
        setIsGenerating(true);
        setTimeout(() => { // Simulate processing time for better UX
            const newReceiptData: ReceiptData = {
                ...formData,
                receiptNumber: `ORB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
                receiptDate: new Date().toISOString(),
            };
            setReceiptData(newReceiptData);
            setShowPreview(true);
            setIsGenerating(false);
            setTimeout(() => {
                document.getElementById('receipt-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }, 500);
    }, []);

    const handleGenerateNew = useCallback(() => {
        setShowPreview(false);
        // Delay clearing data to allow for smooth transition out
        setTimeout(() => {
            setReceiptData(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }, []);

    const handleSuggestDetails = async (tripDescription: string, tripMonth: string) => {
        if (!tripDescription) {
            alert('Por favor, ingrese una descripción del viaje primero.');
            return null;
        }
        try {
            const suggestions = await generateTripDetails(tripDescription, tripMonth);
            return suggestions;
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
            alert('Hubo un error al obtener sugerencias de la IA. Por favor, inténtelo de nuevo.');
            return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                    {/* Form Section */}
                    <div className={`transition-opacity duration-500 ${showPreview ? 'lg:opacity-100' : 'lg:opacity-100'}`}>
                         <div className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-lg border border-white/50">
                            <ReceiptForm 
                                onGenerate={handleGenerateReceipt} 
                                onSuggest={handleSuggestDetails}
                                isGenerating={isGenerating}
                            />
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div id="receipt-preview-container" className="mt-8 lg:mt-0">
                        {showPreview && receiptData ? (
                            <div className="print-area">
                                <ReceiptPreview data={receiptData} onGenerateNew={handleGenerateNew} />
                            </div>
                        ) : (
                            <div className="no-print hidden lg:flex flex-col items-center justify-center bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/50 h-full min-h-[500px]">
                                <DocumentDuplicateIcon className="w-24 h-24 text-indigo-300" />
                                <h3 className="mt-6 text-xl font-bold text-slate-700">Vista Previa del Comprobante</h3>
                                <p className="mt-2 text-center text-slate-500">Complete el formulario para generar el comprobante de abono aquí.</p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-semibold">
                                  <SparklesIcon className="w-5 h-5" />
                                  <span>Potenciado con IA de Gemini</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="text-center py-6 text-sm text-slate-500 no-print">
                <p>&copy; {new Date().getFullYear()} Orbitravel. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default App;
