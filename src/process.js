import { axiosInstance as axios, Log } from './envSetup';

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

const rax = require('retry-axios');

function extractProductName(product) {
  return product?.model || 'Unknown Model';
}

function extractProductQuantity(product) {
  return product?.quantity || 0;
}

function extractProductImage(product) {
  const fileName = product?.mainImage?.fileName;
  return fileName ? `https://thumbs.static-thomann.de/thumb/thumb220x220/pics/prod/${fileName}` : false;
}

function extractProductPrice(product) {
  const secondaryPrice = product?.price?.secondary;
  const billingPrice = product?.price?.billingPrice;
  const rawPrice = secondaryPrice?.rawPrice || billingPrice?.rawPrice;
  return (parseFloat(rawPrice) || 0).toFixed(2);
}

function extractProductCurrency(product) {
  const secondaryPrice = product?.price?.secondary;
  const billingPrice = product?.price?.billingPrice;
  return secondaryPrice?.currency?.key || billingPrice?.currency?.key || 'NO CURRENCY';
}

function extractProductVatStatus(product) {
  const secondaryPrice = product?.price?.secondary;
  const billingPrice = product?.price?.billingPrice;
  return secondaryPrice?.includesVat || billingPrice?.includesVat || false;
}

function extractProductAvailability(product) {
  return product?.availability?.isAvailable || false;
}

function extractProductBstockStatus(product) {
  return product?.isBstock || false;
}

function extractProductUrl(product) {
  const relativeLink = product?.relativeLink || '';
  return relativeLink ? `https://www.thomann.de/intl/${relativeLink}` : '';
}

function extractProductManufacturer(product) {
  return product?.manufacturer || '';
}

function extractSingleProduct(product) {
  return {
    name: extractProductName(product),
    quantity: extractProductQuantity(product),
    price: extractProductPrice(product),
    image: extractProductImage(product),
    currency: extractProductCurrency(product),
    isAvailable: extractProductAvailability(product),
    isBstock: extractProductBstockStatus(product),
    productUrl: extractProductUrl(product),
    includesVat: extractProductVatStatus(product),
    manufacturer: extractProductManufacturer(product),
  };
}

function filterOutProducts(products) {
  return products.filter((product) => {
    const price = parseFloat(extractProductPrice(product));
    const currency = extractProductCurrency(product);

    // Filter out products more expensive than 700 euros
    if (currency === 'EUR' && price > 700) {
      return false;
    }

    // Keep products in other currencies or less than 700 euros
    return product.ecommerceEventItem?.item_category2 !== 'SYZU';
  });
}

function extractProductInfo(responseData) {
  const products = responseData?.articleListsSettings?.articles || [];
  const filteredProducts = filterOutProducts(products);
  const extractedProducts = filteredProducts.map(extractSingleProduct);

  // Separate Behringer products from others
  const behringerProducts = [];
  const otherProducts = [];

  extractedProducts.forEach((product) => {
    if (product.name.toLowerCase().includes('behringer') || product.manufacturer.toLowerCase().includes('behringer')) {
      // Append "Behringer" to the product name if it's not already included
      if (!product.name.toLowerCase().includes('behringer')) {
        product.name = `Behringer ${product.name}`;
      }
      behringerProducts.push(product);
    } else {
      otherProducts.push(product);
    }
  });

  // Combine arrays with Behringer products at the top
  return [...behringerProducts, ...otherProducts];
}

export const fetchThomanData = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://www.thomann.de/intl/search_searchAjax.html?marketingAttributes%5B%5D=BLOWOUT&vf=true&oa=pra&gk=TASY&sp=solr&category%5B%5D=TASYDR&category%5B%5D=TASYGB&category%5B%5D=TASYEX&category%5B%5D=TASYSY&category%5B%5D=TASYSA&cme=true&filter=true&ls=100',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,mk;q=0.8,ru;q=0.7,bg;q=0.6',
        'content-type': 'application/json',
        origin: 'https://www.thomann.de',
        priority: 'u=1, i',
        referer:
          'https://www.thomann.de/intl/all-products-from-the-category-synthesizers.html?marketingAttributes%5B%5D=BLOWOUT&vf=true&gk=TASY&sp=solr&category%5B%5D=TASYDR&category%5B%5D=TASYGB&category%5B%5D=TASYEX&category%5B%5D=TASYSY&category%5B%5D=TASYSA&cme=true&filter=true&ls=100',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
      data: {
        contextUrl:
          'https://www.thomann.de/intl/all-products-from-the-category-synthesizers.html?marketingAttributes%5B%5D=BLOWOUT&vf=true&oa=pra&gk=TASY&sp=solr&category%5B%5D=TASYDR&category%5B%5D=TASYGB&category%5B%5D=TASYEX&category%5B%5D=TASYSY&category%5B%5D=TASYSA&cme=true&filter=true&ls=100',
      },
    });
    // Usage example
    const productInfo = extractProductInfo(response.data);

    return productInfo;
  } catch (error) {
    Log.error('Error fetching data from Thomann:', error);
    throw error;
  }
};
