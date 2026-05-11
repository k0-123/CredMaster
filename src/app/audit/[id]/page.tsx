import { Metadata } from "next";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import AuditClient from "./AuditClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Metadata generation for Open Graph tags
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let auditData = null;

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) {
      auditData = {
        totalMonthlySavings: data.total_monthly_savings,
        totalAnnualSavings: data.total_annual_savings,
        teamSize: JSON.parse(data.input).teamSize,
        toolCount: JSON.parse(data.tool_results).length,
      };
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  if (!auditData) {
    return {
      title: "AI Spend Audit | CredMaster",
      description: "Find waste in your AI tool subscriptions and get actionable savings recommendations.",
    };
  }

  const title = `I found $${auditData.totalMonthlySavings}/month in AI savings`;
  const fullTitle = `${title} — CredMaster`;
  const description = `${auditData.teamSize}-person team could save $${auditData.totalAnnualSavings}/year on AI tools. See how.`;
  const ogImageUrl = `${appUrl}/api/og?savings=${auditData.totalMonthlySavings}&annual=${auditData.totalAnnualSavings}&tools=${auditData.toolCount}`;
  const pageUrl = `${appUrl}/audit/${id}`;

  return {
    title: fullTitle,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [ogImageUrl],
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AuditClient id={id} />;
}
