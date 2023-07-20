import Head from "next/head";
import { api } from "~/utils/api";
import type { GetServerSidePropsContext } from "next";

export default function ProfilePage({ username }) {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  //console.log(username);

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <main className="flex h-screen justify-center">
          <div>{data.username}</div>
        </main>
      </PageLayout>
    </>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No Slug!");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });
  //await helpers.post.byId.prefetch({ id });
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
}
