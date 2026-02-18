import { Post } from "@/sanity/types";
import HomeBlog from "./HomeBlog";
import SideBlogCard from "./SideBlogCard";


interface SideProps {
  post: Post[];
}
export default function SideBlog({ post }: SideProps) {
  return (
    <>
      {/* HomeBlog on small screens */}
      <div className="block md:hidden">
        <HomeBlog post={post} />
      </div>

      {/* SideBlogCard on medium and up */}
      <div className="hidden md:block">
        <SideBlogCard post={post} />
      </div>
    </>
  );
};

