import React from "react";

const ShippingReturnRefund = () => {
  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fdfdfd",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 119, 204, 0.2)",
    border: "2px solid rgba(0, 119, 204, 0.3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333"
  };

  const brandHeadingStyle = {
    textAlign: "center",
    fontSize: "2.8rem",
    color: "#0077cc",
    fontWeight: "bold",
    textShadow: "0 0 6px rgba(0, 119, 204, 0.5)",
    marginBottom: "10px"
  };

  const subHeadingStyle = {
    textAlign: "center",
    color: "#444",
    fontSize: "1.2rem",
    marginBottom: "30px"
  };

  const sectionStyle = {
    marginBottom: "25px"
  };

  const titleStyle = {
    color: "#0077cc",
    fontSize: "1.3rem",
    marginBottom: "8px",
    fontWeight: "600"
  };

  const textStyle = {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#555"
  };

  return (
    <div style={containerStyle}>
      <h1 style={brandHeadingStyle}>Lord Glory</h1>
      <p style={subHeadingStyle}>Shipping, Return & Refund Policy</p>

      <div style={sectionStyle}>
        <h3 style={titleStyle}>🚚 Shipping</h3>
        <p style={textStyle}>
          All orders are processed and shipped within 3–4 working days. Once shipped, tracking details will be shared via email or SMS.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={titleStyle}>🔄 Return</h3>
        <p style={textStyle}>
          Returns are accepted within 3–4 working days after receiving the product. Please make sure the item is unused and in original condition.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={titleStyle}>💸 Refund</h3>
        <p style={textStyle}>
          The refunded amount will be credited to your original payment method within 3–4 working days after the return is processed successfully.
        </p>
      </div>
    </div>
  );
};

export default ShippingReturnRefund;
