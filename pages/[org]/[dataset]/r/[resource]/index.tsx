import { GetServerSideProps } from 'next';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { initializeApollo } from '../../../../../lib/apolloClient';
import utils from '../../../../../utils';
import Head from 'next/head';
import Nav from '../../../../../components/home/Nav';
import About from '../../../../../components/resource/About';
import DataExplorer from '../../../../../components/resource/DataExplorer';

const QUERY = gql`
  query dataset($id: String!) {
    dataset(id: $id) {
      result {
        resources {
          name
          title
        }
      }
    }
  }
`;

function Resource({ variables }) {
  const {
    data: {
      dataset: { result },
    },
  } = useQuery(QUERY, { variables });

  return (
    <>
      <Head>
        <title>
          Portal | {result.resources[0].title || result.resources[0].name}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="p-6">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          {result.resources[0].title || result.resources[0].name}
        </h1>
        <About variables={variables} />
        <DataExplorer variables={variables} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const variables = {
    id: context.query.dataset,
    resource: context.query.resource,
  };

  const apolloResponse = await apolloClient.query({
    query: QUERY,
    variables,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      variables,
    },
  };
};

export default Resource;
