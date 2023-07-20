import Head from "next/head";
import { api } from "~/utils/api";
import type { GetServerSidePropsContext } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";

export default function SinglePostPage({ id }: { id: string }) {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  //console.log(username);

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No Slug!");

  await helpers.posts.getById.prefetch({ id });
  //await helpers.post.byId.prefetch({ id });
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}
