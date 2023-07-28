import React , {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';

function Register()  {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('http://localhost:8000/register', {
            method:'POST',
            body: JSON.stringify({
                title: "Register",
                body: {
                    username: username,
                    password: password,
                    email: email
                }
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                if (res.status === 404) {
                    setError('Username is already taken!');
                }
                else {
                    navigate('/');
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
        else if (event.target.id === "password") {
            setPassword(event.target.value);
        }
        else {
            setEmail(event.target.value);
        };  
    };

    return (
            <div className="App">
                <form style={{marginLeft:'35%',marginRight:'35%',marginTop:'15%'}} onSubmit={handleRegister}>
                    <div className="form-outline mb-4">
                    <input type="username" id="username" className="form-control" onChange={handleChange} />
                    <label className="form-label">Username</label>
                    <p className="error">{error}</p>
                    </div>

                    <div className="form-outline mb-4">
                    <input type="password" id="password" className="form-control" onChange={handleChange} />
                    <label className="form-label">Password</label>
                    </div>

                    <div className="form-outline mb-4">
                    <input type="email" id="email" className="form-control" onChange={handleChange} />
                    <label className="form-label">Email</label>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>

                </form>
            </div>
    );
}

export default Register;
