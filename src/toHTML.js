const htmlTemplate = (dataToInsert) => `
<html xmlns:bar="http://www.bar.org" xmlns:foo="http://www.foo.org/">
  <body style="text-align: center">
    <table border="1">
      <tr bgcolor="#9acd32">
        <th>Name</th>
        <th>Price</th>
        <th>Available</th>
        <th>B-Stock</th>
        <th>Product URL</th>
        <th>Includes VAT</th>
        <th>Image</th>
      </tr>
      ${dataToInsert}
    </table>
  </body>
</html>
`;

export const transformToHTML = (products) => {
  const dataToHtml = products
    .map((product) => {
      return /*html*/ `
        <tr>
          <td>${product.name.toLowerCase().includes('behringer') ? `<strong>${product.name}</strong>` : product.name}</td>
          <td><strong>${product.currency} ${product.price}</strong></td>
          <td>${product.isAvailable ? 'Yes' : 'No'}</td>
          <td>${product.isBstock ? 'Yes' : 'No'}</td>
          <td><a href="${product.productUrl}" target="_blank">View Product</a></td>
          <td>${product.includesVat ? 'Yes' : 'No'}</td>
          <td>${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">` : ''}</td>
        </tr>
      `;
    })
    .join('');

  const html = htmlTemplate(dataToHtml);
  return html;
};
