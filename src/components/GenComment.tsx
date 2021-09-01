import { useEffect, useState } from "react";
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

export default function GenComment(): JSX.Element {

  let initialCommentTree: T_Comment[] = [
    // sample comment
    {
      id: "0",
      content: "Please share your opinion on my new car?",
      replies: [
        {
          id: "0-0",
          content: "that's trash!!",
          replies: []
        },
        {
          id: "0-1",
          content: "i love it!!!!!!!!",
          replies: []
        }
      ]
    }
  ];

  const [commentTree, setCommentTree] = useState(initialCommentTree);
  const [replyStatus, setReplyStatus] = useState({ id: "0", status: false });
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    // updates the commentTree whenever a new comment is added.
    setCommentTree(commentTree);
  }, [commentTree]);

  const addReply = (parent_id: string): void => {
    // toggle textarea based on id
    return replyStatus.status
      ? setReplyStatus({ id: parent_id, status: false })
      : setReplyStatus({ id: parent_id, status: true });
  };

  const genId = (parent_id: string, reply: T_Comment): string => {
    // generates a new id based on the replies' array length
    let new_id : string = "";
    let length: number = reply.replies.length;
    if (length === 0) {
      new_id = parent_id + "-" + 0;
    } else {
      new_id = parent_id + "-" + length;
    }
    return new_id;
  };

  const dfs = (obj: T_Comment, targetId: string): T_Comment | undefined => {
    // depth-first-search to find the target object
    if (obj.id === targetId) {
      return obj;
    }
    if (obj.replies) {
      for (let item of obj.replies) {
        let check = dfs(item, targetId);
        if (check) {
          return check;
        }
      }
    }
  };

  const submitReply = (parent_id: string): void => {
    // submits the new reply to replies array index 
    let result: T_Comment | any = {};

    for (let obj of commentTree) {
      result = dfs(obj, parent_id);
      if (result) {
        break;
      }
    }

    let new_id = genId(parent_id, result);

    let newObj = {
      id: new_id,
      content: replyContent,
      replies: []
    };

    // push the new object to the result index
    result.replies.push(newObj);
    // resets the reply status back to false which hides the reply box.
    setReplyStatus({ id: "0", status: false });
    // resets the reply box's content
    setReplyContent("");
  };

  const commenter = (comment: T_Comment): JSX.Element => (
    <div key={comment.id} className="comment">
      <div className="content">
        <div>{comment.content}</div>
        <Button variant="contained" color="primary" onClick={() => addReply(comment.id)}>Reply</Button>
      </div>
      {replyStatus.status === true && replyStatus.id === comment.id ? (
        <div className="reply-box">
          <form>
            <TextField
              fullWidth
              className="textarea"
              autoFocus
              label="Add a comment"
              multiline
              rows={4}
              variant="outlined"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />{" "}
          </form>
          <Button
          variant="contained" color="primary"
            onClick={() => {
              replyContent.length !== 0 ? submitReply(comment.id) : setReplyStatus({ id: "0", status: false });
            }}
          >
            submit
          </Button>
        </div>
      ) : (
        <></>
      )}
      {comment.replies.map((reply) => {
        return commenter(reply);
      })}
    </div>
  );

  return <>{commentTree.map((comment) => commenter(comment))}</>;
}
