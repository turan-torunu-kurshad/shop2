import React, {useEffect, useState} from "react";
import client from "../api/client";

export default function AdminReports() {
  const [rows, setRows] = useState([]);
  useEffect(()=> {
    async function load() {
      try {
        const r = await client.get("/admin/reports/orders");
        setRows(r.data.rows || []);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);
  return (<div style={{padding:20}}>
    <h2>Ú¯Ø²Ø§Ø±Ø´ Ø³ÙØ§Ø±Ø´ Ù‡Ø§</h2>
    <table border="1" cellPadding="6">
      <thead><tr><th>order</th><th>user</th><th>product</th><th>qty</th><th>price</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.order_id+""+r.product_id}><td>{r.order_id}</td><td>{r.name}</td><td>{r.title}</td><td>{r.quantity}</td><td>{r.price_snapshot}</td></tr>))}</tbody>
    </table>
  </div>);
}
