import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MessageArea from "./Messages/MessageArea";
/* eslint-disable */

function Chat() {
  // State to store messages
  const [messages, setMessages] = useState([]);

  return (
    <DashboardLayout style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <DashboardNavbar />
      <div style={{ flex: 1, display: "flex", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
        {/* Section for user list */}
        <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #ccc" }}>
          <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            Users
          </h2>
          {/* Add user list here */}
        </div>
        {/* Section for message area */}
        <div style={{ flex: 3, padding: "20px" }}>
          <MessageArea messages={messages} setMessages={setMessages} />
        </div>
      </div>
      <Footer style={{ marginTop: "auto", borderTop: "1px solid #ccc", padding: "20px 0" }} />
    </DashboardLayout>
  );
}

export default Chat;
