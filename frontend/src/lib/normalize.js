export function getCartProductId(item) {
  return item.productId || item.product;
}

export function getCartItemKey(item) {
  return `${getCartProductId(item)}_${item.size}_${item.color}`;
}

