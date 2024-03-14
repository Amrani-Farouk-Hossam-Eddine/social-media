import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("users/find/" + id).then((res) => {
        return res.data;
      }),
  });
  const { isLoading: rIsloading, data: rData } = useQuery({
    queryKey: ["relationships"],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + id).then((res) => {
        return res.data;
      }),
  });
  console.log(data);

  const mutation = useMutation({
    mutationFn: (followed) => {
      if (followed)
        return makeRequest.delete("/relationships?followedUserId=" + id);
      return makeRequest.post("/relationships?followedUserId=" + id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    },
  });

  const handleFollow = (e) => {
    e.preventDefault();
    mutation.mutate(rData.includes(currentUser[0].id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <img
              src={"/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsloading ? (
                  "loading"
                ) : id === currentUser[0].id.toString() ? (
                  <button onClick={() => setOpenUpdate(!openUpdate)}>
                    update
                  </button>
                ) : (
                  <button onClick={handleFollow}>
                    {rData.includes(currentUser[0].id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={data.id} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
