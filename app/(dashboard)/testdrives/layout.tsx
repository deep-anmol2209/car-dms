export default function TestDrivesLayout({
    children,
    modal,
  }: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }) {
    return (
      <>
        {children}
        {modal}
      </>
    );
  }
  