import { notFound } from "next/navigation";
import AdminDashboard from "./view";

type Props = { searchParams: { key?: string } };

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Admin | Family Wahala OS", robots: { index: false, follow: false } };

export default function AdminPage({ searchParams }: Props) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || !searchParams.key || searchParams.key !== adminKey) notFound();
  return <AdminDashboard adminKey={adminKey} />;
}
