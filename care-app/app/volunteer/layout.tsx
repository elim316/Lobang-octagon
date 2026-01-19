// app/volunteer/layout.tsx
import VolunteerShellServer from "./VolunteerShellServer";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <VolunteerShellServer>{children}</VolunteerShellServer>;
}
