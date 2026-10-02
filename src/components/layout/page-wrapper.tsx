function PageWrapper({ pageTitle, children }: { pageTitle: string; children: React.ReactNode }) {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
      {children}
    </div>
  )
}

export default PageWrapper