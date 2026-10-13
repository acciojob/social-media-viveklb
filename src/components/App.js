
import React from "react";
import { BrowserRouter, Link, Route, Switch, useHistory, useParams } from "react-router-dom";

const authors = ["Alex Morgan", "Jordan Lee", "Taylor Kim"];

const initialPosts = [
  { id: "1", title: "A little inspiration", author: authors[0], content: "Make today count.", reactions: [0, 0, 0, 0, 0] },
  { id: "2", title: "Weekend plans", author: authors[1], content: "Looking forward to a relaxing weekend.", reactions: [0, 0, 0, 0, 0] },
  { id: "3", title: "On my way", author: authors[2], content: "Big things are coming soon!", reactions: [0, 0, 0, 0, 0] },
];

const reactionNames = ["Like", "Love", "Wow", "Celebrate", "Support"];

function PostList({ posts, onReact }) {
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {posts.map((post) => (
        <article className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>By {post.author}</p>
          <p>{post.content}</p>
          <div>
            {reactionNames.map((name, index) => (
              <button
                className="button"
                key={name}
                type="button"
                onClick={() => index < 4 && onReact(post.id, index)}
              >
                {name} {post.reactions[index]}
              </button>
            ))}
          </div>
          <Link className="button" to={`/posts/${post.id}`}>View Post</Link>
        </article>
      ))}
    </section>
  );
}

function PostForm({ onCreate }) {
  const history = useHistory();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    onCreate({
      id: String(Date.now()),
      title: form.elements.postTitle.value,
      author: form.elements.postAuthor.value,
      content: form.elements.postContent.value,
      reactions: [0, 0, 0, 0, 0],
    });
    form.reset();
    history.push("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <label htmlFor="postTitle">Title</label>
      <input id="postTitle" name="postTitle" required />
      <label htmlFor="postAuthor">Author</label>
      <select id="postAuthor" name="postAuthor" required defaultValue={authors[0]}>
        {authors.map((author) => <option key={author} value={author}>{author}</option>)}
      </select>
      <label htmlFor="postContent">Content</label>
      <textarea id="postContent" name="postContent" required />
      <button className="button" type="submit">Submit</button>
    </form>
  );
}

function PostDetail({ posts, onUpdate }) {
  const { postId } = useParams();
  const post = posts.find((item) => item.id === postId);
  const [editing, setEditing] = React.useState(false);

  if (!post) return <main><p>Post not found.</p></main>;

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    onUpdate({ ...post, title: form.elements.postTitle.value, content: form.elements.postContent.value });
    setEditing(false);
  }

  return (
    <main>
      <article className="post">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="postTitle">Title</label>
            <input id="postTitle" name="postTitle" defaultValue={post.title} required />
            <label htmlFor="postContent">Content</label>
            <textarea id="postContent" name="postContent" defaultValue={post.content} required />
            <button className="button" type="submit">Save Changes</button>
          </form>
        ) : (
          <>
            <h2>{post.title}</h2>
            <p>By {post.author}</p>
            <p>{post.content}</p>
            <button className="button" type="button" onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </article>
    </main>
  );
}

function UsersPage({ posts }) {
  const { userId } = useParams();
  const selectedAuthor = userId ? authors[Number(userId) - 1] : null;
  const userPosts = selectedAuthor ? posts.filter((post) => post.author === selectedAuthor) : [];

  return (
    <main>
      <h2>Users</h2>
      <ul>
        {authors.map((author, index) => (
          <li key={author}><Link to={`/users/${index + 1}`}>{author}</Link></li>
        ))}
      </ul>
      {selectedAuthor && <PostList posts={userPosts} onReact={() => {}} />}
    </main>
  );
}

function NotificationsPage() {
  const [refreshed, setRefreshed] = React.useState(false);

  return (
    <main>
      <h2>Notifications</h2>
      <button className="button" type="button" onClick={() => setRefreshed(true)}>Refresh Notifications</button>
      <section className="notificationsList">
        {refreshed && ["Your feed is up to date.", "Welcome to GenZ!", "Discover what your friends are sharing."].map((notification) => (
          <div key={notification}>{notification}</div>
        ))}
      </section>
    </main>
  );
}

const App = () => {
  const [posts, setPosts] = React.useState(initialPosts);

  function createPost(post) {
    setPosts((currentPosts) => [post, ...currentPosts]);
  }

  function updatePost(updatedPost) {
    setPosts((currentPosts) => currentPosts.map((post) => post.id === updatedPost.id ? updatedPost : post));
  }

  function reactToPost(postId, reactionIndex) {
    setPosts((currentPosts) => currentPosts.map((post) => post.id === postId
      ? { ...post, reactions: post.reactions.map((count, index) => index === reactionIndex ? count + 1 : count) }
      : post));
  }

  return (
    <BrowserRouter>
      <div className="App">
        <h1>GenZ</h1>
        <nav>
          <Link to="/">Posts</Link>{" "}
          <Link to="/users">Users</Link>{" "}
          <Link to="/notifications">Notifications</Link>{" "}
          <Link to="/create">Create Post</Link>
        </nav>
        <Switch>
          <Route exact path="/">
            <main>
              <PostForm onCreate={createPost} />
              <PostList posts={posts} onReact={reactToPost} />
            </main>
          </Route>
          <Route exact path="/create"><PostForm onCreate={createPost} /></Route>
          <Route exact path="/users/:userId"><UsersPage posts={posts} /></Route>
          <Route exact path="/users"><UsersPage posts={posts} /></Route>
          <Route exact path="/notifications"><NotificationsPage /></Route>
          <Route exact path="/posts/:postId"><PostDetail posts={posts} onUpdate={updatePost} /></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App
