import React  from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function Home() {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setAuth] = React.useState(false);
  
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
        .then((res) => res.json())
        .then((res) => {
          if (res.authToken === "okay") {
            setAuth(true);
          }
        })
        .catch((err) => {
            console.log(err.message);
        });
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.id === "username") {
      setUsername(event.target.value);
  }
  else {
      setPassword(event.target.value);
  }
  
};

  return (
    <div>
      {isLoggedIn ? (
        // Authenticated layout
        <div>
          <h1>Welcome to the Authenticated App!</h1>
          <button>Logout</button>
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
