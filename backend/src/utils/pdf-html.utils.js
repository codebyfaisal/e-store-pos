import { taxRate } from "../config/env.config.js";
export const generateHTML = (invoice) => {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.unit_price * item.qty,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return `
  <html>
  <meta charset="UTF-8">
  <title>E - Store Invoice - ${invoice.id}</title>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Play:wght@400;700&display=swap"
      rel="stylesheet"
    />
  <style>
    body {
      font-family: Play, 'Hanken Grotesk', monospace, system-ui, sans-serif;
      background: #f9fafb;
      color: rgba(0, 0, 0, 0.9);
      padding: 1rem;
    }

    .invoice-box {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      color: rgba(0, 0, 0, 0.8);
      max-width: 800px;
      margin: auto;
    }

    .flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .justify-between {
      justify-content: space-between;
    }
    
    .justify-end {
      justify-content: flex-end;
    }

    .text-primary {
      color: #3b82f6;
    }

    .font-bold {
      font-weight: bold;
    }

    .text-right {
      text-align: right;
    }

    .text-left {
      text-align: left;
    }

    .text-center {
      text-align: center;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .text-lg {
      font-size: 1.125rem;
    }

    .text-xl {
      font-size: 1.25rem;
    }

    .text-xs {
      font-size: 0.75rem;
    }

    .mb-6 {
      margin-bottom: 1.5rem;
    }

    .mb-2 {
      margin-bottom: 0.5rem;
    }

    .my-4 {
      margin: 1rem 0;
    }
    
    .p-6 {
      padding: 1.5rem;
    }

    .pt-1 {
      padding-top: 0.25rem;
    }

    .border-b {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    .w-full {
      width: 100%;
    }

    .w-1-3 {
      width: 33.333%;
    }

    .w-fit {
      width: fit-content;
    }

    .rounded-none {
      border-radius: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 1rem 0;
    }

    hr {
      border: none;
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }

    .bg-base-200 {
      background: #e5e7eb;
    }

    .text-[1.01rem] {
      font-size: 1.01rem;
    }

    mx-auto {
      margin: auto;
    }

    .mt-4 {
      margin-top: 1rem;
    }

    .mt-6 {
      margin-top: 1.5rem;
    }

    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .w-max {
      width: max-content;
    }
  </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="flex justify-between mb-6">
        <div> 
          <h3 class="text-xl font-bold">E - STORE</h3>
          <h4 class="text-sm">Invoice For: <br/> Purchase of Products</h4>
        </div>
        <div class="w-fit text-sm text-right">
          <p class="font-bold">
            Invoice No: <span class="text-primary font-bold">#${
              invoice.invoice_id
            }</span>
          </p>
          <p>Created Date: ${new Date(
            invoice.issue_date
          ).toLocaleDateString()}</p>
          <p>Due Date: ${new Date(invoice.issue_date).toLocaleDateString()}</p>
        </div>
      </div>

      <hr class="my-4" />

      <div class="flex justify-between mb-6">
        <div class="text-sm">
          <h3 class="font-semibold text-lg">From</h3>
          <p class="text-primary font-bold">E - STORE</p>
          <p><strong>Address:</strong> 123 Main St, Peshawar</p>
          <p><strong>Email:</strong> estore@contact.com</p>
          <p><strong>Phone:</strong> +1 989 654 3210</p>
        </div>
        <div class=" text-sm">
          <h3 class="font-semibold text-lg">To</h3>
          <p class="font-bold text-primary">${invoice.customer_name}</p>
          <p>${invoice.customer_address}</p>
          <p>Phone: ${invoice.customer_phone}</p>
        </div>
      </div>

      <hr class="my-4" />

      <table class="text-sm text-right">
        <thead class="border-b">
          <tr>
            <th class="text-left">Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody id="invoice_items">
          ${invoice.items
            .map(
              (item) => `
            <tr class="border-b">
              <td class="text-left">${item.item_name}</td>
              <td>${item.qty}</td>
              <td>$${item.unit_price.toFixed(2)}</td>
              <td>$${(item.unit_price * item.qty).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="flex justify-end">
        <div class="text-sm w-1-3 pt-1">
          <div class="flex justify-between border-b">
            <p class="font-bold">Sub Total:</p>
            <p id="subtotal">$${subtotal.toFixed(2)}</p>
          </div>
          <div class="flex justify-between border-b">
            <p class="font-bold">Discount (0%):</p>
            <p id="discount">$0.00</p>
          </div>
          <div class="flex justify-between border-b">
            <p class="font-bold">Tax (${taxRate}%):</p>
            <p id="vat">$${tax.toFixed(2)}</p>
          </div>
          <div class="text-[1.01rem] flex justify-between">
            <p class="font-bold">Total Amount:</p>
            <p class="font-bold" id="total">$${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 text-sm">
        <div>
          <p>Payment made via PayPal / cheque in the name of ${
            invoice.customer_name
          }</p>
          <p>Account Number: 123456789</p>
        </div>
        <hr class="my-4" />
        <div class="text-sm py-3">
          <p class="font-semibold">Terms and Conditions</p>
          <p>
            Please pay within 15 days from the date of invoice.
          </p>
        </div>
      </div>

      <hr class="my-4" />

      <div class="text-center text-sm bg-base-200 py-3">
          This is a computer-generated invoice, no signature required.
      </div>
    </div>
  </body>
</html>
  `;
};
