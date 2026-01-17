// app/staff/layout.tsx
import StaffShellServer from "./StaffShellServer";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffShellServer>{children}</StaffShellServer>;
}
