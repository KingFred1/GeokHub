// /emails/welcome-email.tsx
type WelcomeEmailProps = {
  name: string;
};

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const subscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe?from=welcome`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.5 }}>
      <h1>Welcome to GeokHub, {name}🎉😊!</h1>
      <p>
        We're excited to have you on board. Explore tools, learn, and grow with us!
      </p>
      <p>
        Want to stay updated with our latest news and insights?
      </p>
      <a
        href={subscribeUrl}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Subscribe to Our Newsletter
      </a>
      <p style={{ fontSize: "12px", marginTop: "20px", color: "#666" }}>
        You can unsubscribe anytime.
      </p>
    </div>
  );
}
