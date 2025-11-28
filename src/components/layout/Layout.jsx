import ResizableNavbar from "./ResizableNavbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Resizable Top Navigation */}
      <ResizableNavbar />

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  );
};

export default Layout;
