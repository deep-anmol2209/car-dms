"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-4xl text-red-600">🚫</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-600">
          You don’t have permission to access this page.  
          If you believe this is a mistake, please contact your administrator.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Go Back
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}