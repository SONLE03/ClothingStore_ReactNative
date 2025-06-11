export default class ProductUtils {
  static getDisplayPrice(productVariants: any[]): string {
    if (!productVariants || productVariants.length === 0) return '0';

    const prices = productVariants
      .map(variant => variant.Price)
      .filter(price => typeof price === 'number');

    if (prices.length === 0) return '0';

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice
      ? minPrice.toLocaleString()
      : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
  }
}
