import { CircleHelp, FileText, Info, PhoneCall, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

/* ─── Shared legal page fetcher ──────────────────────────────────── */
const useLegalPage = (pageKey: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["store-content"],
    queryFn: () => api.get<{ data: any }>("/store/content")
  });
  const page = (data?.data?.legalPages || []).find((p: any) => p.page_key === pageKey);
  return { page, isLoading };
};

/* ─── Legal page shell ───────────────────────────────────────────── */
const LegalPage = ({
  pageKey,
  title,
  icon
}: {
  pageKey: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const { page, isLoading } = useLegalPage(pageKey);

  const hasHtml = typeof page?.content === "string" && /<[a-z][\s\S]*>/i.test(page.content);

  return (
    <div className="page-stack">
      <section className="glass prose-panel">
        <div className="legal-page-hero">
          <span className="title-icon">{icon}</span>
          <div>
            <p className="eyebrow">Legal</p>
            <h1>{page?.title || title}</h1>
            {page?.meta_description && (
              <p className="legal-page-lead">{page.meta_description}</p>
            )}
          </div>
        </div>

        <div className="legal-divider" />

        {isLoading ? (
          <div className="legal-loading">
            <div className="legal-skeleton" />
            <div className="legal-skeleton" style={{ width: "82%" }} />
            <div className="legal-skeleton" style={{ width: "90%" }} />
          </div>
        ) : page?.content ? (
          hasHtml ? (
            /* Render rich HTML stored by admin */
            <div
              className="content-copy legal-rich"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            /* Plain text — wrap paragraphs */
            <div className="content-copy legal-plain">
              {page.content.split(/\n\n+/).map((para: string, i: number) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          )
        ) : (
          <div className="legal-empty">
            <p>
              This page has not been configured yet. Go to <strong>Admin → Content → Legal Pages</strong> to
              add the {title} content.
            </p>
          </div>
        )}

        <div className="legal-footer-note">
          {page?.updated_at && (
            <span>Last updated: {new Date(page.updated_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>
          )}
        </div>
      </section>
    </div>
  );
};

/* ─── Public page exports ────────────────────────────────────────── */
export const AboutPage = () => (
  <LegalPage pageKey="about" title="About Us" icon={<Info size={22} />} />
);

export const TermsPage = () => (
  <LegalPage pageKey="terms" title="Terms & Conditions" icon={<FileText size={22} />} />
);

export const PrivacyPage = () => (
  <LegalPage pageKey="privacy" title="Privacy Policy" icon={<Shield size={22} />} />
);

/* ─── FAQ Page ───────────────────────────────────────────────────── */
export const FaqPage = () => {
  const contentQuery = useQuery({
    queryKey: ["store-content"],
    queryFn: () => api.get<{ data: any }>("/store/content")
  });

  const faqs: any[] = contentQuery.data?.data?.faqs || [];

  return (
    <div className="page-stack">
      <section className="glass prose-panel">
        <div className="legal-page-hero">
          <span className="title-icon"><CircleHelp size={22} /></span>
          <div>
            <p className="eyebrow">Support</p>
            <h1>Frequently Asked Questions</h1>
          </div>
        </div>
        <div className="legal-divider" />
        <div className="faq-list">
          {faqs.length ? (
            faqs.map((faq: any) => (
              <article key={faq.id} className="faq-item">
                <strong>{faq.question}</strong>
                {faq.category ? <span className="faq-category">{faq.category}</span> : null}
                <p>{faq.answer}</p>
              </article>
            ))
          ) : (
            <p>No FAQs are published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

/* ─── Contact Page ───────────────────────────────────────────────── */
export const ContactPage = () => {
  const contentQuery = useQuery({
    queryKey: ["store-content"],
    queryFn: () => api.get<{ data: { socialLinks: any[] } }>("/store/content")
  });
  const settingsQuery = useQuery({
    queryKey: ["store-settings"],
    queryFn: () => api.get<{ data: { websiteSettings: any } }>("/store/settings")
  });
  const settings = settingsQuery.data?.data?.websiteSettings;
  const socialLinks = contentQuery.data?.data?.socialLinks || [];

  return (
    <div className="page-stack">
      <section className="glass prose-panel">
        <div className="legal-page-hero">
          <span className="title-icon"><PhoneCall size={22} /></span>
          <div>
            <p className="eyebrow">Get in touch</p>
            <h1>Contact Us</h1>
          </div>
        </div>
        <div className="legal-divider" />
        <div className="contact-grid">
          {settings?.support_email && (
            <a href={`mailto:${settings.support_email}`} className="contact-item">
              <strong>Email</strong>
              <span>{settings.support_email}</span>
            </a>
          )}
          {settings?.support_phone && (
            <a href={`tel:${settings.support_phone}`} className="contact-item">
              <strong>Phone</strong>
              <span>{settings.support_phone}</span>
            </a>
          )}
          {settings?.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="contact-item contact-item--wa"
            >
              <strong>WhatsApp</strong>
              <span>{settings.whatsapp_number}</span>
            </a>
          )}
          {settings?.contact_address && (
            <div className="contact-item">
              <strong>Address</strong>
              <span>{settings.contact_address}</span>
            </div>
          )}
          {!settings?.support_email && !settings?.support_phone && !settings?.contact_address && (
            <p>Contact details are managed from the admin settings panel.</p>
          )}
        </div>
        {socialLinks.length > 0 && (
          <div className="store-social-links">
            {socialLinks.map((item: any) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer">
                {item.platform}
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
