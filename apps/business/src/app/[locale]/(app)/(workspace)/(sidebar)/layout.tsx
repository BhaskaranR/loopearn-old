import { Header } from "@/components/header";
import dynamic from "next/dynamic";

const ClientSidebarWrapper = dynamic(
  () =>
    import("@/components/sidebar-wrapper").then((mod) => mod.SidebarWrapper),
  { ssr: false },
);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSidebarWrapper headerContent={<Header />}>
      {children}
    </ClientSidebarWrapper>
  );
}
