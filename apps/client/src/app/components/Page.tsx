import React, { ReactNode } from 'react';
import { Container } from 'semantic-ui-react';

interface Props {
  children: ReactNode;
}

function Page({ children }: Props) {
  return <Container text>{children}</Container>;
}

export default Page;
