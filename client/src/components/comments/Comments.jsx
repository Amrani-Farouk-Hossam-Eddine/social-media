import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [desc, setDesc] = useState("");
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });
  const mutaion = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    mutaion.mutate({ desc, postId });
    setDesc("");
  };

  const deleteMutaion = useMutation({
    mutationFn: (id) => {
      return makeRequest.delete("/comments/" + id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });

  const handleDelete = (id) => {
    deleteMutaion.mutate(id);
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser[0].profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "loading..."
        : data.map((comment) => (
            <div className="comment">
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <div className="commentInfo">
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
                <DeleteOutlineOutlinedIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleDelete(comment.id)}
                />
              </div>
            </div>
          ))}
    </div>
  );
};

export default Comments;
