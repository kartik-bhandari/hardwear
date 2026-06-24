export function getAbsoluteUrl(url, req) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${protocol}://${host}${cleanUrl}`;
}

export function normalizeProduct(product, req) {
  if (!product) return product;
  const doc = product.toObject ? product.toObject() : product;
  if (doc.images && Array.isArray(doc.images)) {
    doc.images = doc.images.map((img) => getAbsoluteUrl(img, req));
  }
  return doc;
}

export function normalizeCart(cart, req) {
  if (!cart) return cart;
  const doc = cart.toObject ? cart.toObject() : cart;
  if (doc.items && Array.isArray(doc.items)) {
    doc.items = doc.items.map((it) => ({
      ...it,
      imageAtAdd: getAbsoluteUrl(it.imageAtAdd, req),
    }));
  }
  return doc;
}

export function normalizeOrder(order, req) {
  if (!order) return order;
  const doc = order.toObject ? order.toObject() : order;
  if (doc.items && Array.isArray(doc.items)) {
    doc.items = doc.items.map((it) => ({
      ...it,
      image: getAbsoluteUrl(it.image, req),
    }));
  }
  return doc;
}
