import React, {useEffect, useRef}  from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function Home() {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setAuth] = React.useState(false);
  const [messages, setMessages] = React.useState<string[]>([]);
  const [isConnectionOpen, setConnection] = React.useState(false);
  const [messageData, setMessageData] = React.useState("");
  const ws = useRef<WebSocket | undefined>();

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch('http://localhost:8000/login', {
        method:'POST',
        body: JSON.stringify({
            title: "Login",
            body: {
                username: username,
                password: password
            }
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => {
          if (res.status === 200) {
            setAuth(true);
            localStorage.setItem('isLoggedIn', 'true');
          }
        })
        .catch((err) => {
            console.log(err.message);
        });
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> ) => {
  if (event.target.id === "username") {
      setUsername(event.target.value);
  }
  else if (event.target.id === "info"){
      setMessageData(event.target.value);
  }
  else {
      setPassword(event.target.value);
  }
  
};

const sendMessage = () => {
  if (messageData && ws.current) {
    ws.current.send(
      JSON.stringify({
        sender: username,
        body: messageData,
      })
    );
    setMessageData("");
  }
};

useEffect(() => {
  ws.current = new WebSocket("ws://localhost:8000");

  // Opening the ws connection

  ws.current.onopen = () => {
    console.log("Connection opened");
    setConnection(true);
  };

  // Listening on ws new added messages

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setMessages((_messages) => [..._messages, data]);
  };

  return () => {
    if (ws.current) {
      console.log("Cleaning up...");
      ws.current.close();
    }
  };
}, []);

useEffect(() => {
  const loggedInUser = localStorage.getItem("isLoggedIn");
  if (loggedInUser) {
    const foundUser = JSON.parse(loggedInUser);
    setAuth(foundUser);
  }
}, []);

  return (
    <div>
      {isLoggedIn ? (
        // Authenticated layout
        <div>
          <form style={{marginLeft:'35%',marginRight:'35%',marginTop:'15%'}} onSubmit={sendMessage}>
            <div className="form-outline mb-4">
              <input type="username" id="username" className="form-control" onChange={handleChange} />
              <label className="form-label">Username</label>
            </div>

            <div className="form-outline mb-4">
              <input id="room" className="form-control" onChange={handleChange} />
              <label className="form-label">Room Name / ID </label>
            </div>


            <div className="row mb-4">
              <div className="col d-flex justify-content-center">
                <div className="form-check">
                  <textarea className="form-control" id="info" rows={3} onChange={handleChange}/>
                  <label className="form-check-label"> Relevant Info </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block mb-4">Ask to join</button>
          </form>
          <button onClick={() => {setAuth(false);localStorage.clear()}}>Logout</button>
        </div>
      ) : (
      <form style={{marginLeft:'35%',marginRight:'35%',marginTop:'15%'}} onSubmit={handleLogin}>
        <div className="form-outline mb-4">
          <input type="username" id="username" className="form-control" onChange={handleChange} />
          <label className="form-label">Username</label>
        </div>

        <div className="form-outline mb-4">
          <input type="password" id="password" className="form-control" onChange={handleChange} />
          <label className="form-label">Password</label>
        </div>


        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="form2Example31" />
              <label className="form-check-label"> Remember me </label>
            </div>
          </div>

          <div className="col">

            <a href="#!">Forgot password?</a>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

        <div className="text-center">
          <p>Not a member? <a href="/register">Register</a></p>
        </div>
      </form>
      )}
    </div>
  );
}

export default Home;
