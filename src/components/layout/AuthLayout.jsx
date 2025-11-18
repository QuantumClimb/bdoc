/**
 * AuthLayout Component
 * Layout for unauthenticated pages (Login, Splash Screen)
 * No header/footer, centered content
 */

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-darker overflow-hidden">
      {children}
    </div>
  );
}

export default AuthLayout;
