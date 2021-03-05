var products;

export function getProducts() {
  if (!products) {
    throw 'Producsts not yet initialised';
  }
  return products;
}

export default function(opts) {
  products = [{
    id: 1,
    name: 'product-1',
    details: {
      price: 105,
      specs: {size: 10, weight: 20},
      info: {sku: 30}
    }
  }, {
    id: 2,
    name: 'product-2',
    details: {
      price: 205,
      specs: {size: 100, weight: 200},
      info: {sku: 300}
    }
  }];
  opts.success();
}
