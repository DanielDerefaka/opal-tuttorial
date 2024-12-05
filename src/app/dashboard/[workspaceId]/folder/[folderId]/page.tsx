import { getAllUserVideos, getFolderInfo } from "@/actions/workspace";
import FolderInfo from "@/components/global/folders/FolderInfo";
import Videos from "@/components/global/videos";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type PageProps = {
  params: {
    workspaceId: string;
    folderId: string;
  };
};
const page = async ({ params }: PageProps) => {
  const workspaceId = await params.workspaceId;
  const folderId = await params.folderId;

  console.log(workspaceId, folderId);

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["folder-videos"],
    queryFn: () => getAllUserVideos(folderId),
  });

  await query.prefetchQuery({
    queryKey: ["folder-info"],
    queryFn: () => getFolderInfo(folderId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={folderId} />
      <Videos workspaceId={workspaceId} folderId={folderId} videosKey="folder-videos" />
    </HydrationBoundary>
  );
};

export default page;
