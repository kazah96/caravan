type PageLayoutProps = {
  children: React.ReactNode;
};

function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  return <div>{children}</div>;
}

export { PageLayout };
