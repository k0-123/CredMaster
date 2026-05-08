import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditEmail(params: {
  to: string;
  auditId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize: number;
  topRecommendation: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key") {
    console.log(`[EMAIL SIMULATION] Would have sent email to: ${params.to}`);
    console.log(`Savings: $${params.totalMonthlySavings}/mo, Top Recommendation: ${params.topRecommendation}`);
    return;
  }

  const { to, auditId, totalMonthlySavings, totalAnnualSavings, topRecommendation } = params;
  const isOptimal = totalMonthlySavings === 0;
  
  const subject = isOptimal 
    ? "Your AI Spend Audit: You're spending well" 
    : `Your AI Spend Audit: $${totalMonthlySavings}/month savings found`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportUrl = `${appUrl}/audit/${auditId}`;

  const boxBg = isOptimal ? "#eff6ff" : "#f0fdf4";
  const boxBorder = isOptimal ? "#dbeafe" : "#dcfce7";
  const boxText = isOptimal ? "#1e40af" : "#166534";
  const boxLabel = isOptimal ? "Your stack is well-optimized" : `$${totalMonthlySavings} / month in potential savings`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h1 style="color: #4f46e5; font-size: 24px; font-weight: bold; margin-bottom: 24px;">CredMaster</h1>
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Here's your audit summary</h2>
      
      <div style="background-color: ${boxBg}; border: 1px solid ${boxBorder}; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <div style="color: ${boxText}; font-size: 24px; font-weight: bold;">${boxLabel}</div>
        ${!isOptimal ? `<div style="color: #64748b; margin-top: 8px;">That's $${totalAnnualSavings} / year in found waste.</div>` : ""}
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Your top recommendation:</h3>
        <p style="font-size: 16px; line-height: 1.6; color: #334155;">${topRecommendation}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <a href="${reportUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Your Full Report →</a>
      </div>

      ${totalMonthlySavings > 500 ? `
      <div style="border-top: 1px solid #e2e8f0; padding-top: 32px; margin-bottom: 32px;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Want help capturing all of this?</p>
        <a href="https://credex.ai" style="color: #4f46e5; font-weight: 600; text-decoration: underline;">Book a Free Credex Consultation →</a>
      </div>
      ` : ""}

      <footer style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="font-size: 12px; color: #94a3b8;">You're receiving this because you used CredMaster. We won't spam you.</p>
      </footer>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "audits@yourdomain.com",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
