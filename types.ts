
export interface ReceiptData {
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    tripDescription: string;
    tripMonth: string;
    paxCount: string;
    tripInclusions: string;
    totalTripValue: number;
    amountPaid: number;
    generalDetails: string;
    receiptNumber: string;
    receiptDate: string; // ISO 8601 string
}

export interface GeminiSuggestion {
    inclusions: string;
    details: string[];
}
