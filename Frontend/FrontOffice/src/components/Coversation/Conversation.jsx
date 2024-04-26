/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete'; // Import DeleteIcon

const Conversation = ({ data, currentUser, online, onDelete }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [data.members, currentUser, dispatch]);

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <Avatar src={userData?.profileImage} alt="Profile" className="followerImage" style={{ width: "50px", height: "50px" }} />
          <div className="name" style={{ fontSize: '0.8rem' }}>
            <span>{userData?.firstname} {userData?.lastname}</span>
            <span style={{ color: online ? "#51e200" : "#E82227" }}>{online ? " En ligne " : " Deconnecté"}</span>
          </div>
        
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
