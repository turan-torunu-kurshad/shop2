import React from "react";
export default function StockBadge({stock}) {
  const available = stock.available || 0;
  if (available > 10) return <span style={{color:"green"}}>Ù…ÙˆØ¬ÙˆØ¯</span>;
  if (available > 0) return <span style={{color:"orange"}}>Ù…ÙˆØ¬ÙˆØ¯ Ù…Ø­Ø¯ÙˆØ¯ ({available})</span>;
  return <span style={{color:"red"}}>Ù†Ø§Ù…ÙˆØ¬ÙˆØ¯</span>;
}
