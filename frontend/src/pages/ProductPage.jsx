import React, {useEffect, useState} from "react";
import ProductActions from "../components/ProductActions";
import ProductDetails from "../components/ProductDetails";

export default function ProductPage({productId=1, userId=1}) {
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState({qty:0, reserved:0, available:0});
  useEffect(()=> {
    async function load(){
      try {
        const r = await fetch(`/api/products/${productId}`).then(r=>r.json());
        setProduct(r.product);
        setStock(r.stock);
      } catch (err) { console.error(err); }
    }
    load();
  }, [productId]);
  if (!product) return <div>Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ...</div>;
  return (<div style={{padding:20}}>
    <h1>{product.title}</h1>
    <ProductDetails product={product} />
    <ProductActions product={product} stock={stock} userId={userId} />
  </div>);
}
