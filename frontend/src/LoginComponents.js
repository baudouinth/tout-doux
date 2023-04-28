import { Component } from "react";
import { api_request, cookies } from "./utils";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  submit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const auth = btoa(data.username + ":" + data.password);
    api_request("user/login", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + auth
      }
    }).then(response => {
      response.json().then(body => {
        if (response.ok) {
          cookies.set("jwt", body.token);
          window.location.replace("/");
        }
        else {
          this.setState({ message: body.message });
        }
      });
    });
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.submit}>
          <div>
            <label>
              <p>Username</p>
              <input name="username" />
            </label>
            <label>
              <p>Password</p>
              <input name="password" />
            </label>
          </div>
          <p>{this.state.message}</p>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  submit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    api_request("user/register", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok) {
        window.location.replace("/login");
      } else {
        response.json().then(body => {
          this.setState({ message: body.message });
        });
      }
    });
  };

  render() {
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={this.submit}>
          <div>
            <label>
              <p>Username</p>
              <input name="username" />
            </label>
            <label>
              <p>Email</p>
              <input name="email" />
            </label>
            <label>
              <p>Password</p>
              <input name="password" />
            </label>
          </div>
          <p>{this.state.message}</p>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

