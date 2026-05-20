import React from "react";

const DeleteAccount = () => {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", lineHeight: "1.7" }}>
      <h1>Delete Your Trackefy Account</h1>

      <p>
        Trackefy allows users to request deletion of their account and associated data.
        This page explains how parents, drivers, and school users can request account deletion.
      </p>

      <h2>How to request account deletion</h2>
      <p>
        To delete your Trackefy account, send an email to{" "}
        <a href="mailto:trackefy@gmail.com">trackefy@gmail.com</a> with the subject line:
      </p>

      <p><strong>Account Deletion Request - Trackefy</strong></p>

      <p>Please include the following details in your email:</p>
      <ul>
        <li>Your registered email address</li>
        <li>Your role: Parent, Driver, or School</li>
        <li>Your school name, if applicable</li>
        <li>A short confirmation that you want your Trackefy account deleted</li>
      </ul>

      <h2>What data will be deleted</h2>
      <p>After verifying your request, we will delete account-related data such as:</p>
      <ul>
        <li>Account profile information</li>
        <li>Login/authentication-related account data</li>
        <li>Parent, driver, or school profile data linked to the account</li>
        <li>Saved pickup location, where applicable</li>
        <li>Device notification token, where applicable</li>
      </ul>

      <h2>Data that may be retained</h2>
      <p>
        Some data may be retained for a limited period if required for security,
        fraud prevention, legal compliance, dispute resolution, or operational records.
      </p>

      <h2>Processing time</h2>
      <p>
        We aim to process valid account deletion requests within 7 to 30 days after verification.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions, contact us at{" "}
        <a href="mailto:trackefy@gmail.com">trackefy@gmail.com</a>.
      </p>
    </div>
  );
};

export default DeleteAccount;