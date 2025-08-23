import { ArrowDown, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PdfIcon from "/pdf.svg";
import { Loader } from "@/components/index.js";

import { useApiDataStore } from "@/store/index.js";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [loadingMessage, setLoadingMessage] = useState("");

  const { fetchData, downloadFile } = useApiDataStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/invoices/" + id);
    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;
    setData({ ...result });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const handleDownloadPDF = async () => {
    setLoadingMessage("Generating Invoice PDF...");
    try {
      const pdfBlob = await downloadFile(`/api/invoices/${id}/pdf`);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (err) {
      alert("Error fetching invoice PDF. Please try again.");
    } finally {
      setLoadingMessage("");
    }
  };

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Invoice found</div>;

  const invoice = data;
  const subtotal = invoice?.items?.reduce(
    (acc, item) => acc + item.unit_price * item.qty,
    0
  );
  const taxInPercent = invoice.tax / 100;
  const calculatedTax = subtotal * taxInPercent;
  const total = subtotal + calculatedTax;

  return (
    <section>
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold mb-6">Invoice Details</h1>
        <div className="flex gap-2 items-center">
          <button
            className="bg-base-100 p-2 rounded-sm ring ring-base-300/50 hover:ring-primary/10 cursor-pointer"
            onClick={handleDownloadPDF}
            disabled={loadingMessage}
          >
            <img src={PdfIcon} alt="Download PDF" />
          </button>
          <Link to="/invoices" className="btn btn-primary">
            <ArrowLeft size={15} />
            Back to Invoices
          </Link>
        </div>
      </div>

      <div className="bg-base-100 rounded-md p-6 text-base-content/90 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-6 gap-4">
          <p className="text-xl font-bold">E - STORE</p>
          <div className="text-sm text-right space-y-0.5">
            <p className="font-bold">
              Invoice No:{" "}
              <span className="text-primary font-bold">
                #{invoice.invoice_number}
              </span>
            </p>
            <p>
              Created Date: {new Date(invoice.issue_date).toLocaleDateString()}
            </p>
            <p>Due Date: {new Date(invoice.issue_date).toLocaleDateString()}</p>
          </div>
        </div>

        <hr className="border-base-content/20 my-4" />

        {/* From / To Info */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div className="text-sm space-y-0.5">
            <h3 className="font-semibold text-lg">From</h3>
            <p className="text-primary font-bold">E - STORE</p>
            <p>
              <strong>Address:</strong> 123 Main St, Peshawar
            </p>
            <p>
              <strong>Email:</strong> estore@contact.com
            </p>
            <p>
              <strong>Phone:</strong> +1 989 654 3210
            </p>
          </div>
          <div className="text-sm space-y-0.5">
            <h3 className="font-semibold text-lg">To</h3>
            <p className="font-bold text-primary">{invoice.customer_name}</p>
            <p>{invoice.customer_address}</p>
            <p>Phone: {invoice.customer_phone}</p>
          </div>
        </div>

        <hr className="border-base-content/20 my-4" />

        {/* Table Header */}
        <h4 className="font-semibold mb-2">
          Invoice For: Purchase of Products
        </h4>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[32rem]">
            <thead>
              <tr>
                <th className="p-2 text-left">Description</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Unit Price</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2 border-b border-base-content/20 text-left">
                    {item.item_name}
                  </td>
                  <td className="p-2 border-b border-base-content/20">
                    {item.qty}
                  </td>
                  <td className="p-2 border-b border-base-content/20">
                    ${item.unit_price?.toFixed(2)}
                  </td>
                  <td className="p-2 border-b border-base-content/20">
                    {(item.unit_price * item.qty)?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="text-sm w-full sm:w-2/3 md:w-1/3 pt-1">
              <div className="flex justify-between p-2 border-b border-base-content/20">
                <p className="font-bold">Sub Total:</p>
                <p>${subtotal?.toFixed(2)}</p>
              </div>
              <div className="flex justify-between p-2 border-b border-base-content/20">
                <p className="font-bold">Discount (0%):</p>
                <p>$ 0.00</p>
              </div>
              <div className="flex justify-between p-2 border-b border-base-content/20">
                <p className="font-bold">
                  Tax ({invoice.taxInPercent * 100}%):
                </p>
                <p>${calculatedTax?.toFixed(2)}</p>
              </div>
              <div className="text-[1.01rem] flex justify-between p-2">
                <p className="font-bold">Total Amount:</p>
                <p className="font-bold">${total?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info & Terms */}
        <div className="mt-6 text-sm space-y-4">
          <div>
            <p>
              Payment made via PayPal / cheque in the name of{" "}
              {invoice.customer_name}
            </p>
            <p>Account Number: 123456789</p>
          </div>

          <hr className="border-base-content/20" />

          <div>
            <p className="font-semibold">Terms and Conditions</p>
            <p>Please pay within 15 days from the date of invoice.</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex justify-center">
          <p className="text-xs bg-base-200 mt-4 px-4 py-3 w-max text-center">
            This is a computer-generated invoice, no signature required.
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="btn btn-ghost p-2 rounded-sm bg-primary text-base-100 px-3 cursor-pointer"
          onClick={handleDownloadPDF}
          disabled={loadingMessage}
        >
          Download Invoice PDF
          <span className="animate-bounce">
            <ArrowDown className="ml-2" size={15} />
          </span>
        </button>
      </div>
    </section>
  );
};

export default InvoiceDetails;
