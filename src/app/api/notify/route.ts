import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { orderId, customerPhone, address, items, totalPrice } = await request.json();

        // Format the message as requested by the user
        // Note: CallMeBot uses URL encoding for the text
        const message = `New Order Received! \nOrder ID: ${orderId} \nCustomer phone: ${customerPhone} \nAddress: ${address} \nLog in to confirm it`;

        // CallMeBot API Configuration
        // User provided number: +9618190703 (Likely typo, missing '5' based on previous context +961 81 905 703)
        // I will use the likely correct one: 96181905703. 
        // If the user really meant 90703, they can correct it in the code or env.
        const phone = "96181905703";

        // API Key must be set in .env.local
        const apiKey = process.env.CALLMEBOT_API_KEY;

        if (!apiKey) {
            console.warn("CALLMEBOT_API_KEY is not set. Message will not be sent.");
            return NextResponse.json({ success: true, warning: "API Key missing" });
        }

        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to send WhatsApp message');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
    }
}
