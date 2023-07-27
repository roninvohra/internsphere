import React from 'react';
import FlatCommentThread from './FlatCommentThread';

const App = () => {
  const comments = [
    { id: 1, text: "Comment 1", parentId: null },
    { id: 2, text: "Reply to Comment 1", parentId: 1 },
    { id: 3, text: "Comment 2", parentId: null },
    { id: 4, text: "Reply to Comment 2", parentId: 3 },
    { id: 5, text: "Comment 3", parentId: null },
  ];

  return (
    <div>
      <h1>Comments</h1>
      <FlatCommentThread comments={comments} />
    </div>
  );
};

export default App;
