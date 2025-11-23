import React from "react";

export default function ProductDetails({product}) {
  const specs = product.technical_specs || {};
  return (
    <div style={{marginTop:10}}>
      <h3>ØªÙˆØ¶ÛŒØ­Ø§Øª</h3>
      <div dangerouslySetInnerHTML={{__html: product.description || product.short_description || ""}} />
      <h3>Ù…Ø´Ø®ØµØ§Øª ÙÙ†ÛŒ</h3>
      <table border="1" cellPadding="6">
        <tbody>
          {Object.keys(specs).length ? Object.keys(specs).map(k=>(
            <tr key={k}><td style={{fontWeight:"bold"}}>{k}</td><td>{specs[k]}</td></tr>
          )) : <tr><td colSpan="2">Ù…Ø´Ø®ØµØ§Øª ÙÙ†ÛŒ Ø«Ø¨Øª Ù†Ø´Ø¯Ù‡ Ø§Ø³Øª</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
