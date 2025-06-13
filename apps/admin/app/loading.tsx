import { Loader as LoaderComponent, LoaderType } from '@nick8green/components';
import { FC } from 'react';

export const Loader: FC = () => (
  <LoaderComponent type={LoaderType.SPINNER} visible={true} />
);

export default Loader;
