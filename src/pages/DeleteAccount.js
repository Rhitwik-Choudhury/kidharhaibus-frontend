import React from "react";

const DeleteAccount = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          lineHeight: "1.7",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
            color: "#2563eb",
          }}
        >
          Delete Your Trackefy Account
        </h1>

        <p style={{ fontSize: "16px", color: "#4b5563", marginBottom: "28px" }}>
          Trackefy allows parents, drivers, and school users to request deletion
          of their account and associated data. Please follow the steps below to
          submit an account deletion request.
        </p>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>How to Request Account Deletion</h2>

          <p>
            To delete your Trackefy account, send an email to{" "}
            <a href="mailto:trackefy@gmail.com" style={linkStyle}>
              trackefy@gmail.com
            </a>{" "}
            with the subject line:
          </p>

          <div style={highlightBox}>
            Account Deletion Request - Trackefy
          </div>

          <p>Please include the following details in your email:</p>

          <ul style={listStyle}>
            <li>Your registered email address</li>
            <li>Your role: Parent, Driver, or School</li>
            <li>Your school name, if applicable</li>
            <li>A short confirmation that you want your Trackefy account deleted</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>What Data Will Be Deleted</h2>

          <p>
            After verifying your request, we will delete account-related data
            such as:
          </p>

          <ul style={listStyle}>
            <li>Account profile information</li>
            <li>Login and authentication-related account data</li>
            <li>Parent, driver, or school profile data linked to the account</li>
            <li>Saved pickup location, where applicable</li>
            <li>Device notification token, where applicable</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Data That May Be Retained</h2>

          <p>
            Some data may be retained for a limited period if required for
            security, fraud prevention, legal compliance, dispute resolution, or
            operational records.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Processing Time</h2>

          <p>
            We aim to process valid account deletion requests within{" "}
            <strong>7 to 30 days</strong> after verification.
          </p>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 0 }}>
          <h2 style={headingStyle}>Contact</h2>

          <p>
            For any questions, contact us at{" "}
            <a href="mailto:trackefy@gmail.com" style={linkStyle}>
              trackefy@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

const sectionStyle = {
  marginBottom: "30px",
  paddingBottom: "24px",
  borderBottom: "1px solid #e5e7eb",
};

const headingStyle = {
  fontSize: "22px",
  marginBottom: "12px",
  color: "#111827",
};

const listStyle = {
  paddingLeft: "24px",
  marginTop: "10px",
};

const linkStyle = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};

const highlightBox = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
  padding: "12px 16px",
  borderRadius: "10px",
  fontWeight: "700",
  margin: "12px 0 18px",
};

export default DeleteAccount;