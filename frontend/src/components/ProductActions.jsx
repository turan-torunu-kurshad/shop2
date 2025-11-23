import React, {useState} from "react";
import client from "../api/client";

export default function ProductActions({product, stock, userId}) {
  const [msg, setMsg] = useState(null);
  const available = stock.available;
  async function addToCart(q=1) {
    try {
      const res = await client.post(`/cart/${userId}/items`, { productId: product.id, quantity: q});
      setMsg(res.data.message);
    } catch (err) { setMsg("Ø®Ø·Ø§ Ø¯Ø± Ø§ÙØ²ÙˆØ¯Ù† Ø¨Ù‡ Ø³Ø¨Ø¯"); console.error(err); }
  }
  if (!product.is_active) return <button disabled>Ù…Ø­ØµÙˆÙ„ ØºÛŒØ±ÙØ¹Ø§Ù„ Ø§Ø³Øª</button>;
  if (available > 0) {
    return <div style={{marginTop:10}}>
      <button onClick={()=>addToCart(1)}>Ø§ÙØ²ÙˆØ¯Ù† Ø¨Ù‡ Ø³Ø¨Ø¯ ({available} Ù…ÙˆØ¬ÙˆØ¯)</button>
      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </div>;
  }
  if (product.allow_backorder) {
    return <div style={{marginTop:10}}><button onClick={()=>addToCart(1)}>Ù¾ÛŒØ´â€ŒØ³ÙØ§Ø±Ø´</button>{msg && <div style={{marginTop:8}}>{msg}</div>}</div>;
  }
  return <div style={{marginTop:10}}>
    <button disabled>Ù†Ø§Ù…ÙˆØ¬ÙˆØ¯</button>
    <button onClick={async ()=>{ try{ await client.post("/api/waitlist", { userId, productId: product.id, requested_qty:1 }); setMsg("Ø¨Ù‡ Ù„ÛŒØ³Øª Ø§Ù†ØªØ¸Ø§Ø± Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯ÛŒØ¯") }catch(e){setMsg("Ø®Ø·Ø§");} }}>Ø§Ø·Ù„Ø§Ø¹â€ŒØ±Ø³Ø§Ù†ÛŒ Ù‡Ù†Ú¯Ø§Ù… Ù…ÙˆØ¬ÙˆØ¯ÛŒ</button>
    {msg && <div style={{marginTop:8}}>{msg}</div>}
  </div>;
}
