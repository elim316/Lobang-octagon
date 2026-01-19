"use client";

import { useState, Suspense } from "react";
import SignupForm from "./SignupForm";
import RoleSelection from "./RoleSelection";
import UserDetails from "./UserDetails";

export default function SignupPage() {
  // step 0: Signup, 1: Role Selection, 2: User Details
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Called after Supabase creates the user object
  const handleSignupSuccess = (id: string) => {
    setUserId(id);
    setStep(1);
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16, fontFamily: "sans-serif" }}>
      {step === 0 && (
        <>
          <h1 style={{ marginBottom: 20, fontSize: "1.8rem" }}>Create Account</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          </Suspense>
        </>
      )}

      {step === 1 && userId && (
        <RoleSelection 
          userId={userId} 
          onRoleSelected={() => setStep(2)} 
        />
      )}

      {step === 2 && userId && (
        <UserDetails 
          userId={userId} 
          onComplete={() => alert("Registration Complete!")} 
        />
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
