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

  if (isSupabaseConfigured) {
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
  const title = auditData 
    ? `I found $${auditData.totalMonthlySavings}/mo in AI savings` 
    : "AI Spend Audit | CredMaster";
  
  const description = auditData 
    ? `See how this ${auditData.teamSize}-person team can save $${auditData.totalAnnualSavings}/year on AI tools.` 
    : "Find waste in your AI tool subscriptions and get actionable savings recommendations.";

  const ogImageUrl = auditData
    ? `${appUrl}/api/og?savings=${auditData.totalMonthlySavings}&annual=${auditData.totalAnnualSavings}&tools=${auditData.toolCount}`
    : `${appUrl}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AuditClient id={id} />;
}
