import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { TextField, Button, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles((theme) => ({
  messageArea: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  messageItem: {
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  messageText: {
    marginRight: theme.spacing(1),
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  inputField: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  sendButton: {
    marginLeft: theme.spacing(2),
  },
}));

function MessageArea({ messages, setMessages }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue, sender: "Me" }]);
      setInputValue("");
    }
  };

  const deleteMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
  };

  return (
    <div className={classes.messageArea}>
      <Paper className={classes.messageList}>
        {messages.map((message, index) => (
          <div key={index} className={classes.messageItem}>
            <div className={classes.messageText}>
              <strong>{message.sender}:</strong> {message.text}
            </div>
            <IconButton aria-label="delete" onClick={() => deleteMessage(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <div ref={messageEndRef} />
      </Paper>
      <Paper className={classes.inputContainer} elevation={2}>
        <TextField
          className={classes.inputField}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
        />
        <Button
          className={classes.sendButton}
          variant="contained"
          color="primary"
          onClick={sendMessage}
        >
          Send
        </Button>
      </Paper>
    </div>
  );
}

MessageArea.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default MessageArea;
