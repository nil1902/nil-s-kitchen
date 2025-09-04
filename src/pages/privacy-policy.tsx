import React from "react";
import { Separator } from "@/components/ui/separator";

function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-16 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <Separator className="mb-8" />

      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p className="mb-4">
          Bengal Bay ("we," "our," or "us") respects your privacy and is
          committed to protecting it through our compliance with this policy.
        </p>
        <p className="mb-4">
          This policy describes the types of information we may collect from you
          or that you may provide when you visit our website and our practices
          for collecting, using, maintaining, protecting, and disclosing that
          information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information We Collect
        </h2>
        <p className="mb-4">
          We collect several types of information from and about users of our
          website, including information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            By which you may be personally identified, such as name, email
            address, telephone number ("personal information");
          </li>
          <li>
            That is about you but individually does not identify you; and/or
          </li>
          <li>
            About your internet connection, the equipment you use to access our
            website, and usage details.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use information that we collect about you or that you provide to
          us, including any personal information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>To present our website and its contents to you;</li>
          <li>
            To provide you with information, products, or services that you
            request from us;
          </li>
          <li>To fulfill any other purpose for which you provide it;</li>
          <li>To carry out our obligations and enforce our rights;</li>
          <li>
            To notify you about changes to our website or any products or
            services we offer;
          </li>
          <li>
            In any other way we may describe when you provide the information;
          </li>
          <li>For any other purpose with your consent.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Contact Information
        </h2>
        <p className="mb-4">
          To ask questions or comment about this privacy policy and our privacy
          practices, contact us at: info@nilskitchen.com
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
