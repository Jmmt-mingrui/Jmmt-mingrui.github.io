import { SiteShell } from "../components/site-shell";
import { WritingList } from "../components/writing-list";
import { getPostCovers, getPostSummaries } from "../lib/posts";

export default function WritingPage() {
  return (
    <SiteShell>
      <WritingList posts={getPostSummaries()} covers={getPostCovers()} />
    </SiteShell>
  );
}
