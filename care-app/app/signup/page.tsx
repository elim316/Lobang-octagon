"use client";

import { Suspense, useState } from "react";
import SignupForm from "./SignupForm";
import RoleSelection from "./RoleSelection";
import UserDetails from "./UserDetails";

export default function SignupPage() {
  // 0: Signup, 1: Role Selection, 2: User Details
  const [step, setStep] = useState(0);

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 16 }}>
      {/* Step 0: Initial Account Creation */}
      {step === 0 && (
        <>
          <h1 style={{ marginBottom: 16 }}>Sign up</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <SignupForm onSignupSuccess={() => setStep(1)} />
          </Suspense>
        </>
      )}

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <RoleSelection onRoleSelected={() => setStep(2)} />
      )}

      {/* Step 2: Extra Details */}
      {step === 2 && (
        <UserDetails />
      )}
    </div>
  );
}


// // app/signup/page.tsx
// import { Suspense } from "react";
// import SignupForm from "./SignupForm";
// import RoleSelection from "./RoleSelection";
// import UserDetails from "./UserDetails";

// export default function SignupPage() {
//   return (
//     <div style={{ maxWidth: 420, margin: "80px auto", padding: 16 }}>
//       <h1 style={{ marginBottom: 16 }}>Sign up</h1>

//       <Suspense fallback={<div>Loading...</div>}>
//         <SignupForm />
//       </Suspense>
//     </div>
//   );
// }
