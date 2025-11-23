import React, {useState} from "react";
import client from "../api/client";

export default function WaitlistForm({productId, userId}) {
  const [msg, setMsg] = useState(null);
  async function submit() {
    try {
      await client.post("/api/waitlist", { userId, productId, requested_qty:1 });
      setMsg("Ø´Ù…Ø§ Ø¨Ù‡ Ù„ÛŒØ³Øª Ø§Ù†ØªØ¸Ø§Ø± Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯ÛŒØ¯");
    } catch (err) { setMsg("Ø®Ø·Ø§ Ø¯Ø± Ø«Ø¨Øª Ù„ÛŒØ³Øª Ø§Ù†ØªØ¸Ø§Ø±"); }
  }
  return <div>
    <button onClick={submit}>Ø§ÙØ²ÙˆØ¯Ù† Ø¨Ù‡ Ù„ÛŒØ³Øª Ø§Ù†ØªØ¸Ø§Ø±</button>
    {msg && <div>{msg}</div>}
  </div>;
}
