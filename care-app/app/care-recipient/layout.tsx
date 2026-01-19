// app/care-recipient/layout.tsx
import CareRecipientShellServer from "./CareRecipientShellServer";

export default function CareRecipientLayout({ children }: { children: React.ReactNode }) {
  return <CareRecipientShellServer>{children}</CareRecipientShellServer>;
}
