import React from "react";
import { Separator } from "@/components/ui/separator";

function TermsOfService() {
  return (
    <div className="container mx-auto py-16 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <Separator className="mb-8" />

      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
        <p className="mb-4">
          By accessing or using Bengal Bay website, you agree to be bound by
          these Terms of Service and all applicable laws and regulations. If you
          do not agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the
                      materials on Bengal Bay's website for personal, non-commercial
          transitory viewing only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Modify or copy the materials;</li>
          <li>Use the materials for any commercial purpose;</li>
          <li>
            Attempt to decompile or reverse engineer any software contained on
            Bengal Bay's website;
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials; or
          </li>
          <li>
            Transfer the materials to another person or "mirror" the materials
            on any other server.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
        <p className="mb-4">
                      The materials on Bengal Bay's website are provided on an 'as is'
            basis. Bengal Bay makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including, without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
        <p className="mb-4">
                      In no event shall Bengal Bay or its suppliers be liable for any
          damages (including, without limitation, damages for loss of data or
          profit, or due to business interruption) arising out of the use or
                      inability to use the materials on Bengal Bay's website, even if
            Bengal Bay or a Bengal Bay authorized representative has been
          notified orally or in writing of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Contact Information
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact
          us at: info@nilskitchen.com
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
