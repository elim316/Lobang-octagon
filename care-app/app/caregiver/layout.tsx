// app/caregiver/layout.tsx
import CaregiverShellServer from "./CaregiverShellServer";

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  return <CaregiverShellServer>{children}</CaregiverShellServer>;
}
