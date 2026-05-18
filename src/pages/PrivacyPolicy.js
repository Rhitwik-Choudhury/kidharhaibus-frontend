import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy for Trackefy
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Last updated: May 18, 2026
        </p>

        <p className="mb-4">
          Trackefy is a school bus tracking platform designed for schools,
          parents, and drivers. This Privacy Policy explains how Trackefy
          collects, uses, stores, and protects information when users access the
          Trackefy mobile application, web application, and related services.
        </p>

        <p className="mb-6">
          By using Trackefy, you agree to the collection and use of information
          as described in this Privacy Policy.
        </p>

        <Section title="1. Information We Collect">
          <p>
            Trackefy may collect different types of information depending on the
            user role, such as parent, driver, or school.
          </p>

          <h3 className="font-semibold mt-4 mb-2">Account Information</h3>
          <p>
            We may collect information such as name, email address, phone number,
            password/login credentials, user role, school name, and account
            identifiers. This information is used to create accounts, verify
            users, allow login, and provide role-based access.
          </p>

          <h3 className="font-semibold mt-4 mb-2">
            School, Bus, Driver, Student, and Parent Information
          </h3>
          <p>
            Trackefy may collect and store information such as school details,
            bus details, route details, driver details, student name, class, roll
            number, address, assigned bus, student code, and parent-child linking
            information. This information is used to connect parents with the
            correct child and assigned school bus.
          </p>

          <h3 className="font-semibold mt-4 mb-2">Location Information</h3>
          <p>
            Trackefy collects location information for school bus tracking. For
            drivers, Trackefy collects live location during an active trip so
            that parents and schools can view the school bus location in real
            time. For parents, Trackefy may store pickup location information to
            provide ETA and arrival alerts.
          </p>

          <h3 className="font-semibold mt-4 mb-2">Background Location</h3>
          <p>
            Trackefy may collect driver location in the background only during an
            active school bus trip. When a driver starts a trip, Trackefy may
            continue collecting and sending the driver’s location even if the app
            is in the background or the phone is locked. This is required for
            Trackefy’s core functionality, which is live school bus tracking and
            trip safety alerts. Background location tracking stops when the
            driver ends the trip.
          </p>

          <h3 className="font-semibold mt-4 mb-2">
            Push Notification Information
          </h3>
          <p>
            Trackefy may collect and store Firebase Cloud Messaging tokens or
            similar device notification tokens to send trip-related
            notifications, including Trip Started, Arriving in 5 minutes,
            Arrived, and Trip Ended alerts.
          </p>

          <h3 className="font-semibold mt-4 mb-2">
            Technical and Device Information
          </h3>
          <p>
            Trackefy may collect limited technical information such as device
            type, app version, error logs, server logs, and usage-related
            technical data to maintain app reliability, security, and
            performance.
          </p>
        </Section>

        <Section title="2. How We Use Information">
          <ul className="list-disc ml-6 space-y-2">
            <li>Create and manage user accounts</li>
            <li>Allow parents, drivers, and schools to access role-based dashboards</li>
            <li>Link parents with the correct student and assigned bus</li>
            <li>Allow schools to manage buses, students, and drivers</li>
            <li>Track school buses during active trips</li>
            <li>Show live bus location to linked parents and schools</li>
            <li>Send trip status alerts and push notifications</li>
            <li>Calculate ETA and arrival-related alerts</li>
            <li>Improve app performance, reliability, and security</li>
            <li>Provide support and resolve technical issues</li>
          </ul>
        </Section>

        <Section title="3. Location Data Usage">
          <p>
            Driver location is used only for school bus tracking during active
            trips. The driver controls trip tracking by starting and ending the
            trip. Parent pickup location is used to provide arrival and ETA
            alerts. Trackefy does not use location data for advertising.
          </p>
        </Section>

        <Section title="4. Data Sharing">
          <p className="mb-3">
            Trackefy does not sell user data.
          </p>
          <p>
            Trackefy may share or process data only as necessary to provide the
            service, including through trusted service providers such as Firebase
            Cloud Messaging, Google Maps services, cloud hosting and database
            services, and email or communication services. Data may also be
            disclosed if required by law or to protect the rights, safety, and
            security of users, schools, drivers, students, or Trackefy.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            Trackefy uses reasonable technical and organizational measures to
            protect user information. These may include authentication, protected
            API access, secure server communication, role-based access, and
            restricted database access. However, no method of transmission over
            the internet or electronic storage is completely secure, and Trackefy
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            Trackefy retains user data for as long as necessary to provide the
            service, maintain school transport records, comply with legal
            obligations, resolve disputes, and improve app reliability. Location
            data related to active trips may be stored or processed as needed for
            live tracking, trip history, debugging, safety alerts, and service
            reliability.
          </p>
        </Section>

        <Section title="7. Data Deletion Requests">
          <p>
            Users may request account or data deletion by contacting Trackefy at{" "}
            <a
              href="mailto:trackefy@gmail.com"
              className="text-blue-600 underline"
            >
              trackefy@gmail.com
            </a>
            . When a deletion request is received, Trackefy will review and
            process the request, subject to any legal, security,
            fraud-prevention, or operational requirements.
          </p>
        </Section>

        <Section title="8. Children’s Information">
          <p>
            Trackefy may store student-related information provided by schools or
            parents, such as student name, class, roll number, address, assigned
            bus, and student code. Trackefy is intended to be used by schools,
            parents, and drivers. It is not intended for direct unsupervised use
            by children. Student-related information is used only for school bus
            tracking, parent-child-bus linking, and school transport management.
          </p>
        </Section>

        <Section title="9. Notifications">
          <p>
            Trackefy sends push notifications related to school bus trips,
            including trip start, ETA, arrival, and trip end alerts. Users may
            manage notification permissions through their device settings, but
            disabling notifications may affect the usefulness of trip alerts.
          </p>
        </Section>

        <Section title="10. Third-Party Services">
          <p>
            Trackefy may use third-party services including Google Maps,
            Firebase, cloud hosting, database services, and email services. These
            services may process data according to their own privacy policies.
          </p>
        </Section>

        <Section title="11. Changes to This Privacy Policy">
          <p>
            Trackefy may update this Privacy Policy from time to time. Any
            changes will be posted on this page with an updated “Last updated”
            date.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have any questions about this Privacy Policy or want to
            request data deletion, contact us at:
          </p>
          <p className="mt-3">
            <strong>Trackefy</strong>
            <br />
            Email:{" "}
            <a
              href="mailto:trackefy@gmail.com"
              className="text-blue-600 underline"
            >
              trackefy@gmail.com
            </a>
            <br />
            Website:{" "}
            <a
              href="https://trackefy.in"
              className="text-blue-600 underline"
            >
              https://trackefy.in
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
};

export default PrivacyPolicy;