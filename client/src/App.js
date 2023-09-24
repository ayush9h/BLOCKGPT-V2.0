import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./App.css";
import bot from "./Logo.png";
import { BsSend } from "react-icons/bs";
import { MdDelete, MdPrivacyTip } from "react-icons/md";
import {
  AiOutlineQuestionCircle,
  AiFillPlusCircle,
  AiFillMessage,
} from "react-icons/ai";
import io from "socket.io-client";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const socket = io("http://localhost:9000", {
  path: "/socket.io",
  transports: ["websocket"],
});

function Chatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [user, setUser] = useState({});
  const [newSessionCreated, setNewSessionCreated] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setShowSignIn(false);
  };

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    console.log(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = "true";
    setIsLoggedIn(true);
    handleLoginSuccess();
  }

  function handleSignOut(event) {
    setUser({});
    setIsLoggedIn(false);
    document.getElementById("signInDiv").removeAttribute("hidden");
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "215853845060-d4dimifpuqgcerv42nrdblrpd1m6vqb9.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    if (isLoggedIn && user && user.email) {
      // Establish WebSocket connection with the server
      socket.on("connect", () => {
        console.log("WebSocket connected.");
        socket.emit("join", { email: user.email });
      });

      // Handle real-time chat history updates
      socket.on("chat_history_update", (data) => {
        const { session_id, conversation } = data;
        if (session_id === selectedSession) {
          // Update the chat history only if the update is for the selected session
          setChatHistory(conversation);
        }
      });

      // Fetch chat sessions
      fetchChatSessions();
    }
  }, []);

  useEffect(() => {
    // Fetch chat sessions when the user logs in
    if (user && user.email) {
      fetchChatSessions();
    }
  }, [user]);

  useEffect(() => {
    // Fetch chat history when the selected session changes
    if (user && user.email && selectedSession) {
      fetchChatHistory();
    }
  }, [selectedSession]);

  // Fetching chat history of user email of each selected sessions
  const fetchChatHistory = () => {
    if (user && user.email && selectedSession) {
      axios
        .get(
          `http://localhost:9000/api/chat-history/${user.email}/${selectedSession}`
        )
        .then((response) => {
          setChatHistory(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Fetching the number of chat sessions for each user email
  const fetchChatSessions = () => {
    if (user && user.email) {
      axios
        .get(`http://localhost:9000/api/chat-sessions/${user.email}`)
        .then((response) => {
          setChatSessions(response.data);
          if (!selectedSession && response.data.length > 0) {
            setSelectedSession(response.data[0]); // Select the first session by default
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Function if user clicks a new session
  const handleNewChatSession = async () => {
    try {
      // Call the backend to start a new chat session
      const response = await axios.post(
        "http://localhost:9000/api/new-chat-session",
        {
          email: user.email,
        }
      );
      // Refresh the chat sessions list
      fetchChatSessions();
      // Set the newly created session as the selected session
      setSelectedSession(response.data.session_id);
      // Clear chat history when starting a new chat
      setChatHistory([]);
      // Set the flag to indicate a new session has been created
      setNewSessionCreated(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  //Delete chat history of particular session
  const handleDeleteChatHistory = async (session) => {
    try {
      // Delete chat history from MongoDB
      await axios.delete(
        `http://localhost:9000/api/delete-chat-history/${user.email}/${session}`
      );
      // After successful deletion, you might want to refresh the chat history
      fetchChatHistory();

      // Remove the deleted session from the list of sessions
      setChatSessions((prevSessions) =>
        prevSessions.filter((s) => s !== session)
      );
      // If the deleted session was selected, reset the selectedSession state
      if (selectedSession === session) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle submit function, sending the user query to the api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedSession) {
        await handleNewChatSession();
      }
      // Sending the required info to the server
      const response = await axios.post("http://localhost:9000/api", {
        message: message,
        email: user.email,
        name: user.name,
        picture: user.picture,
        session_id: selectedSession,
        new_session: newSessionCreated,
      });

      // Displaying the assistant response in real-time letter by letter
      printResponse(response.data.message);
      setMessage("");

      // Reset the flag after sending the message
      setNewSessionCreated(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Displaying the assistant response in real-time letter by letter
  const printResponse = (message) => {
    setResponse("");
    let index = -1;
    const timer = setInterval(() => {
      if (index >= message.length) {
        clearInterval(timer);
      } else {
        setResponse((prevResponse) => prevResponse + message.charAt(index));
        index++;
      }
    }, 50);
  };

  return (
    <div className="blockgpt__main-container">
      {/* Sign In Container */}
      <div id="signInDiv"></div>

      {/* Navigation Menu - Blockgpt */}
      {user && (
        <div className="account-details__navigation">
          <h1 className="bot__title">
            <span>BLOCK</span>GPT v2.0
            <span className="alpha-build">alpha build</span>
          </h1>
          <Popup
            trigger={
              <button className="instruction-button">
                <MdPrivacyTip />
                <span class="tooltiptext">Privacy Notice</span>
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div className="privacy-container">
                <h1 className="privacy-content__heading">
                  Privacy Policy for 
                  <strong>
                    <span>BLOCK</span>GPT α v2.0
                  </strong>
                </h1>
                <h1 className="info-privacy">Information we collect</h1>
                <ul>
                  <li>
                    <span>Personal Information:</span> When you use BlockGPT, we
                    may collect personal information such as your name, email
                    address, profile picture, and any information you
                    voluntarily provide during your interactions with the
                    application.
                  </li>
                  <li>
                    <span>Chat History:</span> We store and maintain the chat
                    history between you and BlockGPT for improving the
                    application's performance and to provide you with a seamless
                    user experience.
                  </li>
                  <li>
                    <span>Cookies and Similar Technologies:</span> We may use
                    cookies and similar tracking technologies to enhance your
                    user experience, analyze usage patterns, and gather
                    information about how you interact with BlockGPT.
                  </li>
                </ul>
                <h1 className="info-privacy"> Data Protection</h1>
                <p>
                  We take the security of your personal information seriously.
                  BlockGPT employs industry-standard security measures to
                  protect your data from unauthorized access, disclosure,
                  alteration, or destruction.
                </p>
                <h1 className="info-privacy"> Data Sharing</h1>
                <p>
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes. We may share your
                  information with trusted service providers who help us in
                  operating BlockGPT, provided they adhere to strict data
                  protection standards.
                </p>
                <h1 className="info-privacy"> Children Privacy</h1>
                <p>
                  BlockGPT is not intended for use by individuals under the age
                  of 13. We do not knowingly collect personal information from
                  children under 13. If you believe we have unintentionally
                  collected information from a child under 13, please contact us
                  immediately.
                </p>
                <button className="close-instruction" onClick={() => close()}>
                  Close Privacy Policy Window
                </button>
              </div>
            )}
          </Popup>
          <Popup
            trigger={
              <button className="instruction-button">
                <AiOutlineQuestionCircle />
                <span class="tooltiptext">Instructions</span>
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div className="content">
                <h1 className="instruction-header usage">
                  <strong>
                    <span>BLOCK</span>GPT α v2.0
                  </strong>
                </h1>
                <p>
                  This is an early version of <span>BLOCKGPT Alpha v2.0.</span>{" "}
                  There are bugs in this build and we are constantly working on
                  it and improving the user experiences.<br></br> Below are
                  instructions on how to effectively use <span>BLOCK</span>GPT.
                </p>

                <ul>
                  <li>
                    To see your new created session for existing users, change
                    to previously existing sessions and switch back, you will be
                    able to see new created session
                  </li>

                  <li>
                    If you are a new user, click on new chat. After response
                    completion, again click the new chat button. You will be
                    able to see the new session created.
                  </li>

                  <li>
                    To see your new chat history, switch between the current
                    session or any other previous sessions.
                  </li>
                </ul>
                <button className="close-instruction" onClick={() => close()}>
                  Close Instruction Window
                </button>
              </div>
            )}
          </Popup>

          <img src={user.picture} alt="user__image" />
          <h3>{user.name}</h3>
        </div>
      )}

      {/* Side Menu */}
      {Object.keys(user).length !== 0 && (
        <button className="signout" onClick={() => handleSignOut({})}>
          LOGOUT
        </button>
      )}
      <aside className="side-menu">
        <button className="new-chat" onClick={handleNewChatSession}>
          <AiFillPlusCircle />
          New Chat
        </button>
        <h4 className="recent-session">Recent Sessions</h4>
        {chatSessions.map((session, index) => (
          <div key={index} className="session-button-container">
            <button
              className={
                selectedSession === session
                  ? "session-button selected"
                  : "session-button"
              }
              onClick={() => handleSessionSelect(session)}
            >
              <AiFillMessage />
              Session {index + 1}
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteChatHistory(session)}
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </aside>

      <div className="blockgpt__chat-container">
        <div className="chat-history">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <div className="user-responsebox">
                <span>
                  <img src={user.picture} alt="user" />
                </span>
                <p>{entry.user_message}</p>
              </div>
              <div className="assistant-responsebox">
                <span>
                  <img src={bot} alt="bot" />
                </span>
                <p>{entry.response}</p>
              </div>
            </div>
          ))}

          {chatHistory.length === 0 && (
            <p className="return-sessiontext">
              <strong>
                <span>BLOCK</span>GPT α v2.0
              </strong>
            </p>
          )}
          {response && (
            <p className="assistant-response">
              <span>
                <img src={bot} alt="bot" />
              </span>
              <strong>Current Chat: </strong>
              {response}
            </p>
          )}
        </div>
      </div>

      {/* User Inputs a query which is treated as a onchange value, which is submitted to the backend*/}
      <form className="chatbox-form" id="chatbox" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your crypto related query..."
        />
        <button className="submit" type="submit">
          <BsSend />
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
