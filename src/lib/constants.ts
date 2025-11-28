export const WHATSAPP_NUMBER = "96176919542"; 
export const INSTAGRAM_URL = "https://www.instagram.com/waheed_fragrance?igsh=MTdvOG51bDR0cWFvaQ==";
export const STORE_NAME = "Waheed Fragrance";

export const getWhatsAppLink = (message?: string) => {
  const text = encodeURIComponent(
    message || `Hi! I'm interested in learning more about your perfumes.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};

export const getWhatsAppProductLink = (productName: string) => {
  const message = encodeURIComponent(`Hi! I'm interested in ${productName}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export const getWhatsAppOrderLink = (cartItems: any[]) => {
  let message = `New Order Request:\n`;
  
  cartItems.forEach((item, index) => {
    // Defensive: item or nested properties might be missing (older persisted data). Use fallbacks when necessary.
    const name = item?.perfume?.name ?? "Unknown product";
    const size = item?.selectedSize?.size ?? "Unknown size";
    const quantity = typeof item?.quantity === 'number' ? item.quantity : 0;
    message += `${index + 1}. ${name} - Size: ${size} × Quantity: ${quantity}\n`;
  });
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};
