import type { NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Collection from '@/components/Collection';

const QuizPage: NextPage = () => {
  const [address, setAddress] = React.useState<string | undefined>();
  const router = useRouter();

  React.useEffect(() => {
    console.log(router.query);
    if (router.isReady) {
      setAddress(router.query.address?.toString());
    }
  }, [router.isReady, router.query]);

  return <Layout>{!!address && <Collection address={address} />}</Layout>;
};

export default QuizPage;
