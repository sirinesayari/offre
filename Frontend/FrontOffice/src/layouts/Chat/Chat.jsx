/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { userChats } from "../../api/ChatRequests";
import axios from "axios"; // Import axios
import Button from '@material-ui/core/Button';
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AddIcon from '@material-ui/icons/Add';
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import "./Chat.css";
import { MenuItem } from "@mui/material";
import API_URLS from "apiUrls";
import MDBox from "components/MDBox";

function ChatManagement() {
  const socket = useRef();
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [addChatDialogOpen, setAddChatDialogOpen] = useState(false);
  const [newChatData, setNewChatData] = useState({
    receiverId: '', // Add receiverId field
  });
  const [allUsers, setAllUsers] = useState([]); // State to store all users

  useEffect(() => {
    const userId = window.sessionStorage.getItem('userId');
    if (!userId) {
      // Handle if userId is not available in session storage
      return;
    }

    const getChats = async () => {
      try {
        const { data } = await userChats(userId);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    getChats();

    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", userId);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const userId = window.sessionStorage.getItem('userId');
    if (!userId) {
      // Handle if userId is not available in session storage
      return false;
    }
    const chatMember = chat.members.find((member) => member !== userId);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  // Function to fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(API_URLS.getAllUsers);
      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle adding a new chat
  const handleNewConversation = () => {
    fetchAllUsers(); // Fetch all users before opening the dialog
    setAddChatDialogOpen(true);
  };

  const handleCloseAddChatDialog = () => {
    setAddChatDialogOpen(false);
  };

  // Function to handle adding a new chat
const handleAddNewChat = async () => {
  try {
    // Update newChatData with the sender ID
    const userId = window.sessionStorage.getItem('userId');
    const updatedChatData = {
      ...newChatData,
      senderId: userId,
    };

    // Logic to add a new chat
    const response = await axios.post(API_URLS.createChat, updatedChatData);
    const newChat = response.data;
    setChats([...chats, newChat]); // Update chats state with the new chat

    // Close the dialog
    setAddChatDialogOpen(false);
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (chatId) => {
  try {
    setChats(chats.filter((chat) => chat._id !== chatId));
    // Afficher une alerte pour indiquer que le chat a été supprimé avec succès
  } catch (error) {
    console.log(error);
  }
};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={1}>
      <div className="Chat" style={{ marginTop: '20px' }}>
        {/* Left Side */}
        <div className="Left-side-chat">
          <div className="Chat-container">
            <h2>Chats</h2>
            <Button
              variant="contained"
              style={{ backgroundColor: "#db6c6c", color: "#fff", marginBottom: '10px' }}
              size="small"
              onClick={handleNewConversation}
            >
              <AddIcon />
            </Button>
            <div className="Chat-list">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setCurrentChat(chat);
                  }}
                >
                  <Conversation
                    data={chat}
                    currentUser={window.sessionStorage.getItem('userId')}
                    online={checkOnlineStatus(chat)}

                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="Right-side-chat">
          <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          </div>
          <ChatBox
            chat={currentChat}
            currentUser={window.sessionStorage.getItem('userId')}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
            onDelete={handleDelete} // Passer la fonction handleDelete

          />
        </div>
      </div>

      {/* Dialog for adding a new chat */}
      <Dialog open={addChatDialogOpen} onClose={handleCloseAddChatDialog}>
        <DialogTitle>ajouter nouvelle conversation</DialogTitle>
        <DialogContent>
          {/* Form fields for adding a new chat */}
          {/* Select input for choosing receiver */}
          <TextField
            select
            label="Sélectionnez le destinataire"
            value={newChatData.receiverId}
            onChange={(e) => setNewChatData({ ...newChatData, receiverId: e.target.value })}
            fullWidth
            required
          >
            {allUsers.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.firstname} {user.lastname}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAddNewChat}>
            Ajouter conversation
          </Button>
        </DialogContent>
      </Dialog>
</MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ChatManagement;
