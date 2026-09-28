import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { sortByDisplayOrder, formatDate } from '../../../utils/formatters';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import { Award, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import './Certificates.css';

export default function Certificates({ certificates = [] }) {
  const sortedCertificates = sortByDisplayOrder(certificates);

  if (sortedCertificates.length === 0) return null;

  return (
    <section id="certificates" className="certificates-section section-padding">
      <div className="container">
        <SectionHeading title="Certificates & Credentials" subtitle="Validated Industry Expertise" />

        <div className="certificates-grid">
          {sortedCertificates.map((cert) => {
            const certUrl = resolveMediaUrl(cert.certificateUrl);
            const isPdf = cert.certificateUrl && cert.certificateUrl.toLowerCase().endsWith('.pdf');

            return (
              <div key={cert.id} className="cert-card reveal-item in-view">
                <div className="cert-badge-wrap">
                  {cert.certificateUrl && !isPdf ? (
                    <img src={certUrl} alt={cert.title} className="cert-thumb" />
                  ) : (
                    <div className="cert-icon-box">
                      <Award size={28} />
                    </div>
                  )}
                </div>

                <div className="cert-content">
                  <h3 className="cert-title">{cert.title}</h3>
                  <h4 className="cert-org">{cert.issuingOrganization}</h4>

                  {cert.issueDate && (
                    <span className="cert-date">
                      Issued {formatDate(cert.issueDate)}
                      {cert.expiryDate ? ` · Expires ${formatDate(cert.expiryDate)}` : ''}
                    </span>
                  )}

                  {cert.credentialId && (
                    <span className="cert-id-tag">ID: {cert.credentialId}</span>
                  )}

                  {cert.description && (
                    <p className="cert-desc">{cert.description}</p>
                  )}

                  <div className="cert-actions">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-link"
                      >
                        <CheckCircle2 size={14} />
                        <span>Verify Credential</span>
                        <ExternalLink size={12} />
                      </a>
                    )}

                    {certUrl && (
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-link secondary-link"
                      >
                        <FileText size={14} />
                        <span>View Document</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
