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
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className=" absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black  bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400"></div>
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
import Image from "next/image";
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
