import { useState, useEffect, useContext } from "react";
import { Post } from "../post";
import { ApiUrlContext } from "../../pages/index";

export function PostsList() {
  const [posts, setPosts] = useState([]);
  const { urlForGetPosts } = useContext(ApiUrlContext);

  console.log(urlForGetPosts);

  useEffect(() => {
    fetch(urlForGetPosts)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Did't get posts");
        }

        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
      })
      .catch(() => []);
  }, [urlForGetPosts]);

  return (
    <div className="flex gap-5 flex-wrap mx-[84px] mt-2">
      {posts.map((post) => (
        <Post
          key={post.id}
          category={post.category}
          theme={post.theme}
          description={post.description}
          likes={post.likes_count}
          creator={post.creator}
          created={post.created}
        />
      ))}
    </div>
  );
}
